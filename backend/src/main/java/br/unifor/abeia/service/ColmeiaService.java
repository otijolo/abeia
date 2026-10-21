package br.unifor.abeia.service;

import br.unifor.abeia.model.Colmeia;
import br.unifor.abeia.repository.ColmeiaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Camada de serviço de Colmeias na arquitetura MVC.
 */
@Service
public class ColmeiaService {

    private final ColmeiaRepository repository;

    public ColmeiaService(ColmeiaRepository repository) {
        this.repository = repository;
    }

    public List<Colmeia> listarTodas() {
        return repository.listarTodas();
    }

    public List<Colmeia> listarPorApiario(String apiarioId) {
        return repository.listarPorApiario(apiarioId);
    }

    public Optional<Colmeia> buscarPorId(String id) {
        return repository.buscarPorId(id);
    }

    public Colmeia criar(Colmeia colmeia) {
        return repository.salvar(colmeia);
    }

    public Optional<Colmeia> atualizar(String id, Colmeia dados) {
        return repository.buscarPorId(id).map(existente -> {
            if (dados.getNome() != null) existente.setNome(dados.getNome());
            if (dados.getApiarioId() != null) existente.setApiarioId(dados.getApiarioId());
            if (dados.getTipo() != null) existente.setTipo(dados.getTipo());
            if (dados.getPosicao() != null) existente.setPosicao(dados.getPosicao());
            if (dados.getInstaladaEm() != null) existente.setInstaladaEm(dados.getInstaladaEm());
            if (dados.getObservacoes() != null) existente.setObservacoes(dados.getObservacoes());
            if (dados.getStatus() != null) existente.setStatus(dados.getStatus());
            if (dados.getPrazoInspecao() != null) existente.setPrazoInspecao(dados.getPrazoInspecao());
            if (dados.getResumoInspecao() != null) existente.setResumoInspecao(dados.getResumoInspecao());
            if (dados.getProducaoPeriodoKg() != null) existente.setProducaoPeriodoKg(dados.getProducaoPeriodoKg());
            if (dados.getProblemas() != null) existente.setProblemas(dados.getProblemas());
            return repository.salvar(existente);
        });
    }

    public boolean excluir(String id) {
        return repository.excluir(id);
    }
}
