package br.unifor.abeia.config;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;

/** Confere o token no Firebase antes de liberar as operações do usuário. */
@Component
public class FirebaseAuthFilter extends OncePerRequestFilter {
    private final RestTemplate http;
    private final String authUrl;
    private final String apiKey;

    public FirebaseAuthFilter(RestTemplate http,
                              @Value("${firebase.auth-url}") String authUrl,
                              @Value("${firebase.api-key}") String apiKey) {
        this.http = http;
        this.authUrl = authUrl;
        this.apiKey = apiKey;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().substring(request.getContextPath().length()).startsWith("/api/") || request.getMethod().equals("OPTIONS");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        if (authorization == null || !authorization.startsWith("Bearer ") || authorization.length() <= 7) {
            response.sendError(401, "Entre na sua conta para acessar a API.");
            return;
        }
        String token = authorization.substring(7);
        try {
            JsonNode result = http.postForObject(authUrl + "/accounts:lookup?key={key}",
                    Map.of("idToken", token), JsonNode.class, apiKey);
            String uid = result == null ? "" : result.path("users").path(0).path("localId").asText();
            if (!uid.matches("[A-Za-z0-9_-]{1,128}")) {
                response.sendError(401, "Sessão inválida. Entre novamente.");
                return;
            }
            request.setAttribute("firebaseUid", uid);
            request.setAttribute("firebaseToken", token);
        } catch (HttpClientErrorException error) {
            response.sendError(401, "Sessão inválida ou expirada. Entre novamente.");
            return;
        } catch (RestClientException error) {
            response.sendError(503, "Não foi possível verificar a sessão. Tente novamente.");
            return;
        }
        chain.doFilter(request, response);
    }
}
