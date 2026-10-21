package br.unifor.abeia.service;

import br.unifor.abeia.model.Inspecao;
import br.unifor.abeia.repository.ColmeiaRepository;
import br.unifor.abeia.repository.InspecaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Camada de serviço de Inspeções na arquitetura MVC.
 */
@Service
public class InspecaoService {

    private final InspecaoRepository inspecaoRepository;
    private final ColmeiaRepository colmeiaRepository;

    public InspecaoService(InspecaoRepository inspecaoRepository, ColmeiaRepository colmeiaRepository) {
        this.inspecaoRepository = inspecaoRepository;
        this.colmeiaRepository = colmeiaRepository;
    }

    public List<Inspecao> listarTodas() {
        return inspecaoRepository.listarTodas();
    }

    public List<Inspecao> listarPorColmeia(String colmeiaId) {
        return inspecaoRepository.listarPorColmeia(colmeiaId);
    }

    public Optional<Inspecao> buscarPorId(String id) {
        return inspecaoRepository.buscarPorId(id);
    }

    public Inspecao criar(Inspecao inspecao) {
        Inspecao salva = inspecaoRepository.salvar(inspecao);

        // Atualiza o status da colmeia correspondente caso exista
        if (salva.getColmeiaId() != null && salva.getStatus() != null) {
            colmeiaRepository.buscarPorId(salva.getColmeiaId()).ifPresent(colmeia -> {
                colmeia.setStatus(salva.getStatus());
                colmeiaRepository.salvar(colmeia);
            });
        }

        return salva;
    }

    public boolean excluir(String id) {
        return inspecaoRepository.excluir(id);
    }
}
