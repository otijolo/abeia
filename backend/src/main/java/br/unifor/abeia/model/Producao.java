package br.unifor.abeia.model;

/**
 * Modelo que representa um registro de Produção / Colheita de mel.
 */
public class Producao {

    private String id;
    private String colmeiaId;
    private String data;
    private Double quantidade;
    private String unidade;
    private String observacoes;

    public Producao() {
    }

    public Producao(String id, String colmeiaId, String data, Double quantidade, String unidade, String observacoes) {
        this.id = id;
        this.colmeiaId = colmeiaId;
        this.data = data;
        this.quantidade = quantidade;
        this.unidade = unidade;
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

    public Double getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Double quantidade) {
        this.quantidade = quantidade;
    }

    public String getUnidade() {
        return unidade;
    }

    public void setUnidade(String unidade) {
        this.unidade = unidade;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}
