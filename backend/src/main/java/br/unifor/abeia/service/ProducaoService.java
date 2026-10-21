package br.unifor.abeia.service;

import br.unifor.abeia.model.Producao;
import br.unifor.abeia.repository.ProducaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Camada de serviço de Produção na arquitetura MVC.
 */
@Service
public class ProducaoService {

    private final ProducaoRepository repository;

    public ProducaoService(ProducaoRepository repository) {
        this.repository = repository;
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
        return repository.salvar(producao);
    }

    public Optional<Producao> atualizar(String id, Producao dadosAtualizados) {
        return repository.buscarPorId(id).map(producao -> {
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
}
