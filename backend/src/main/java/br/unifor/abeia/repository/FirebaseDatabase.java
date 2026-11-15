package br.unifor.abeia.repository;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/** Acessa somente usuarios/{uid}, usando o token e as regras do próprio Firebase. */
@Component
public class FirebaseDatabase {
    private final RestTemplate http;
    private final ObjectMapper json;
    private final HttpServletRequest request;
    private final String databaseUrl;

    public FirebaseDatabase(RestTemplate http, ObjectMapper json, HttpServletRequest request,
                            @Value("${firebase.database-url}") String databaseUrl) {
        this.http = http;
        this.json = json;
        this.request = request;
        this.databaseUrl = databaseUrl;
    }

    public String usuarioId() {
        Object uid = request.getAttribute("firebaseUid");
        if (uid == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return uid.toString();
    }

    private URI endereco(String caminho) {
        for (String parte : caminho.split("/")) {
            if (!parte.matches("[A-Za-z0-9_-]{1,128}")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Identificador inválido.");
            }
        }
        return UriComponentsBuilder.fromHttpUrl(databaseUrl)
                .pathSegment("usuarios", usuarioId())
                .path("/" + caminho + ".json")
                .queryParam("auth", request.getAttribute("firebaseToken"))
                .build().encode().toUri();
    }

    private JsonNode ler(String caminho) {
        try {
            return http.getForObject(endereco(caminho), JsonNode.class);
        } catch (RestClientException error) {
            throw falha(error);
        }
    }

    public <T> List<T> listar(String colecao, Class<T> tipo) {
        JsonNode dados = ler(colecao);
        List<T> lista = new ArrayList<>();
        if (dados != null && dados.isObject()) {
            dados.fields().forEachRemaining(entry -> {
                ObjectNode valor = ((ObjectNode) entry.getValue()).deepCopy();
                valor.put("id", entry.getKey());
                lista.add(json.convertValue(valor, tipo));
            });
        }
        return lista;
    }

    public <T> Optional<T> buscar(String caminho, Class<T> tipo) {
        JsonNode dados = ler(caminho);
        if (dados == null || dados.isNull()) return Optional.empty();
        if (caminho.contains("/")) {
            ((ObjectNode) dados).put("id", caminho.substring(caminho.lastIndexOf('/') + 1));
        }
        return Optional.of(json.convertValue(dados, tipo));
    }

    public void salvar(String caminho, Object valor) {
        // Mantém campos extras de cadastros existentes que não fazem parte do modelo Java.
        JsonNode existente = ler(caminho);
        ObjectNode dados = existente != null && existente.isObject()
                ? (ObjectNode) existente : json.createObjectNode();
        dados.setAll((ObjectNode) json.valueToTree(valor));
        try {
            http.put(endereco(caminho), dados);
        } catch (RestClientException error) {
            throw falha(error);
        }
    }

    public boolean excluir(String caminho) {
        JsonNode existente = ler(caminho);
        if (existente == null || existente.isNull()) return false;
        try {
            http.delete(endereco(caminho));
            return true;
        } catch (RestClientException error) {
            throw falha(error);
        }
    }

    private ResponseStatusException falha(RestClientException error) {
        // Não devolve a URL nem o token contido na requisição ao Firebase.
        if (error instanceof HttpClientErrorException clientError
                && (clientError.getStatusCode().value() == 401 || clientError.getStatusCode().value() == 403)) {
            return new ResponseStatusException(HttpStatus.FORBIDDEN, "O Firebase não permitiu acessar estes dados.");
        }
        return new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Não foi possível acessar o banco. Tente novamente.");
    }
}
