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
        if (inspecao.getColmeiaId() == null || !colmeiaRepository.existe(inspecao.getColmeiaId())) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "A colmeia selecionada não existe.");
        }
        inspecao.setId(null);
        Inspecao salva = inspecaoRepository.salvar(inspecao);

        // Atualiza o status da colmeia correspondente caso exista
        if (salva.getColmeiaId() != null && salva.getStatus() != null) {
            colmeiaRepository.buscarPorId(salva.getColmeiaId()).ifPresent(colmeia -> {
                colmeia.setStatus(salva.getStatus());
                colmeia.setResumoInspecao(salva.getResumo());
                var resumo = new com.fasterxml.jackson.databind.ObjectMapper().createObjectNode();
                resumo.put("resumo", salva.getResumo());
                resumo.put("saude", "normal".equals(salva.getStatus()) ? "Saudável"
                        : "atencao".equals(salva.getStatus()) ? "Atenção" : "Crítico");
                var detalhes = resumo.putArray("detalhes");
                detalhes.add(salva.getQuadrosCria() + " quadros com cria");
                if (salva.getPragas() == null || salva.getPragas().isEmpty()) detalhes.add("Sem sinais de pragas");
                else salva.getPragas().forEach(detalhes::add);
                colmeia.setUltimaInspecao(resumo);
                colmeiaRepository.salvar(colmeia);
            });
        }

        return salva;
    }

    public boolean excluir(String id) {
        return inspecaoRepository.excluir(id);
    }
}
