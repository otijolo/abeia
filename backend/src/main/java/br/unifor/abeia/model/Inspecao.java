package br.unifor.abeia.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Modelo que representa uma Inspeção na arquitetura MVC.
 */
public class Inspecao {

    private String id;
    private String colmeiaId;
    private String data;
    private String resumo;
    private String status; // normal, atencao, critico
    private String forcaColonia;
    private Boolean rainhaObservada;
    private Integer quadrosAbelhas;
    private Integer quadrosCria;
    private String postura;
    private List<String> pragas = new ArrayList<>();
    private String observacoes;

    public Inspecao() {
    }

    public Inspecao(String id, String colmeiaId, String data, String resumo, String status,
                    String forcaColonia, Boolean rainhaObservada, Integer quadrosAbelhas,
                    Integer quadrosCria, String postura, List<String> pragas, String observacoes) {
        this.id = id;
        this.colmeiaId = colmeiaId;
        this.data = data;
        this.resumo = resumo;
        this.status = status != null ? status : "normal";
        this.forcaColonia = forcaColonia;
        this.rainhaObservada = rainhaObservada != null ? rainhaObservada : false;
        this.quadrosAbelhas = quadrosAbelhas != null ? quadrosAbelhas : 0;
        this.quadrosCria = quadrosCria != null ? quadrosCria : 0;
        this.postura = postura;
        this.pragas = pragas != null ? pragas : new ArrayList<>();
        this.observacoes = observacoes;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getColmeiaId() {
        return colmeiaId;
    }

    public void setColmeiaId(String colmeiaId) {
        this.colmeiaId = colmeiaId;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getResumo() {
        return resumo;
    }

    public void setResumo(String resumo) {
        this.resumo = resumo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getForcaColonia() {
        return forcaColonia;
    }

    public void setForcaColonia(String forcaColonia) {
        this.forcaColonia = forcaColonia;
    }

    public Boolean getRainhaObservada() {
        return rainhaObservada;
    }

    public void setRainhaObservada(Boolean rainhaObservada) {
        this.rainhaObservada = rainhaObservada;
    }

    public Integer getQuadrosAbelhas() {
        return quadrosAbelhas;
    }

    public void setQuadrosAbelhas(Integer quadrosAbelhas) {
        this.quadrosAbelhas = quadrosAbelhas;
    }

    public Integer getQuadrosCria() {
        return quadrosCria;
    }

    public void setQuadrosCria(Integer quadrosCria) {
        this.quadrosCria = quadrosCria;
    }

    public String getPostura() {
        return postura;
    }

    public void setPostura(String postura) {
        this.postura = postura;
    }

    public List<String> getPragas() {
        return pragas;
    }

    public void setPragas(List<String> pragas) {
        this.pragas = pragas;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}
