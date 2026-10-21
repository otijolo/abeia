package br.unifor.abeia.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Modelo que representa uma Colmeia na arquitetura MVC.
 */
public class Colmeia {

    private String id;
    private String nome;
    private String apiarioId;
    private String tipo;
    private String posicao;
    private String instaladaEm;
    private String observacoes;
    private String status; // normal, atencao, critico
    private String prazoInspecao;
    private String resumoInspecao;
    private Double producaoPeriodoKg;
    private List<String> problemas = new ArrayList<>();

    public Colmeia() {
    }

    public Colmeia(String id, String nome, String apiarioId, String tipo, String posicao,
                   String instaladaEm, String observacoes, String status, String prazoInspecao,
                   String resumoInspecao, Double producaoPeriodoKg, List<String> problemas) {
        this.id = id;
        this.nome = nome;
        this.apiarioId = apiarioId;
        this.tipo = tipo;
        this.posicao = posicao;
        this.instaladaEm = instaladaEm;
        this.observacoes = observacoes;
        this.status = status != null ? status : "normal";
        this.prazoInspecao = prazoInspecao;
        this.resumoInspecao = resumoInspecao;
        this.producaoPeriodoKg = producaoPeriodoKg != null ? producaoPeriodoKg : 0.0;
        this.problemas = problemas != null ? problemas : new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getApiarioId() {
        return apiarioId;
    }

    public void setApiarioId(String apiarioId) {
        this.apiarioId = apiarioId;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getPosicao() {
        return posicao;
    }

    public void setPosicao(String posicao) {
        this.posicao = posicao;
    }

    public String getInstaladaEm() {
        return instaladaEm;
    }

    public void setInstaladaEm(String instaladaEm) {
        this.instaladaEm = instaladaEm;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPrazoInspecao() {
        return prazoInspecao;
    }

    public void setPrazoInspecao(String prazoInspecao) {
        this.prazoInspecao = prazoInspecao;
    }

    public String getResumoInspecao() {
        return resumoInspecao;
    }

    public void setResumoInspecao(String resumoInspecao) {
        this.resumoInspecao = resumoInspecao;
    }

    public Double getProducaoPeriodoKg() {
        return producaoPeriodoKg;
    }

    public void setProducaoPeriodoKg(Double producaoPeriodoKg) {
        this.producaoPeriodoKg = producaoPeriodoKg;
    }

    public List<String> getProblemas() {
        return problemas;
    }

    public void setProblemas(List<String> problemas) {
        this.problemas = problemas;
    }
}
