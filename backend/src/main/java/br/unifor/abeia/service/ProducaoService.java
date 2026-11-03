package br.unifor.abeia.service;

import br.unifor.abeia.model.Producao;
import br.unifor.abeia.repository.ProducaoRepository;
import br.unifor.abeia.repository.ColmeiaRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;

import java.util.List;
import java.util.Optional;

/**
 * Camada de serviço de Produção na arquitetura MVC.
 */
@Service
public class ProducaoService {

    private final ProducaoRepository repository;
    private final ColmeiaRepository colmeiaRepository;

    public ProducaoService(ProducaoRepository repository, ColmeiaRepository colmeiaRepository) {
        this.repository = repository;
        this.colmeiaRepository = colmeiaRepository;
    }

    public List<Producao> listarTodas() {
        return repository.listarTodas();
    }

    public List<Producao> listarPorColmeia(String colmeiaId) {
        return repository.listarPorColmeia(colmeiaId);
    }

    public Optional<Producao> buscarPorId(String id) {
        return repository.buscarPorId(id);
    }

    public Producao criar(Producao producao) {
        validar(producao);
        producao.setId(null);
        return repository.salvar(producao);
    }

    public Optional<Producao> atualizar(String id, Producao dadosAtualizados) {
        return repository.buscarPorId(id).map(producao -> {
            validar(dadosAtualizados);
            if (dadosAtualizados.getColmeiaId() != null) producao.setColmeiaId(dadosAtualizados.getColmeiaId());
            if (dadosAtualizados.getData() != null) producao.setData(dadosAtualizados.getData());
            if (dadosAtualizados.getQuantidade() != null) producao.setQuantidade(dadosAtualizados.getQuantidade());
            if (dadosAtualizados.getUnidade() != null) producao.setUnidade(dadosAtualizados.getUnidade());
            if (dadosAtualizados.getObservacoes() != null) producao.setObservacoes(dadosAtualizados.getObservacoes());
            return repository.salvar(producao);
        });
    }

    public boolean excluir(String id) {
        return repository.excluir(id);
    }

    private void validar(Producao producao) {
        if (!colmeiaRepository.existe(producao.getColmeiaId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A colmeia selecionada não existe.");
        }
        if (producao.getQuantidade() == null || !Double.isFinite(producao.getQuantidade()) || producao.getQuantidade() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe uma quantidade maior que zero.");
        }
        try {
            String data = producao.getData();
            DateTimeFormatter formato = data.contains("/")
                    ? DateTimeFormatter.ofPattern("dd/MM/uuuu").withResolverStyle(ResolverStyle.STRICT)
                    : DateTimeFormatter.ISO_LOCAL_DATE;
            LocalDate.parse(data, formato);
        } catch (DateTimeParseException | NullPointerException error) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe uma data válida.");
        }
    }
}
