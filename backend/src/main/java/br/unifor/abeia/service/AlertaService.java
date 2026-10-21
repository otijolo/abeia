package br.unifor.abeia.service;

import br.unifor.abeia.model.Alerta;
import br.unifor.abeia.repository.AlertaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Camada de serviço de Alertas na arquitetura MVC.
 */
@Service
public class AlertaService {

    private final AlertaRepository repository;

    public AlertaService(AlertaRepository repository) {
        this.repository = repository;
    }

    public List<Alerta> listarTodos() {
        return repository.listarTodos();
    }

    public Optional<Alerta> buscarPorId(String id) {
        return repository.buscarPorId(id);
    }

    public Alerta criar(Alerta alerta) {
        return repository.salvar(alerta);
    }

    public Optional<Alerta> atualizar(String id, Alerta dadosAtualizados) {
        return repository.buscarPorId(id).map(alerta -> {
            if (dadosAtualizados.getTitulo() != null) alerta.setTitulo(dadosAtualizados.getTitulo());
            if (dadosAtualizados.getTituloDetalhe() != null) alerta.setTituloDetalhe(dadosAtualizados.getTituloDetalhe());
            if (dadosAtualizados.getOrigem() != null) alerta.setOrigem(dadosAtualizados.getOrigem());
            if (dadosAtualizados.getQuando() != null) alerta.setQuando(dadosAtualizados.getQuando());
            if (dadosAtualizados.getData() != null) alerta.setData(dadosAtualizados.getData());
            if (dadosAtualizados.getStatus() != null) alerta.setStatus(dadosAtualizados.getStatus());
            if (dadosAtualizados.getEstado() != null) alerta.setEstado(dadosAtualizados.getEstado());
            if (dadosAtualizados.getMotivo() != null) alerta.setMotivo(dadosAtualizados.getMotivo());
            if (dadosAtualizados.getAfetados() != null) alerta.setAfetados(dadosAtualizados.getAfetados());
            if (dadosAtualizados.getColmeiaId() != null) alerta.setColmeiaId(dadosAtualizados.getColmeiaId());
            return repository.salvar(alerta);
        });
    }

    public Optional<Alerta> atualizarEstado(String id, String novoEstado) {
        return repository.buscarPorId(id).map(alerta -> {
            alerta.setEstado(novoEstado);
            return repository.salvar(alerta);
        });
    }

    public boolean excluir(String id) {
        return repository.excluir(id);
    }
}
