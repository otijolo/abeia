package br.unifor.abeia.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Pattern;

/**
 * Modelo que representa um registro de Produção / Colheita de mel.
 */
public class Producao {

    private String id;
    @NotBlank(message = "Selecione uma colmeia.")
    private String colmeiaId;
    @NotBlank(message = "Informe a data da produção.")
    private String data;
    @NotNull(message = "Informe a quantidade produzida.")
    @Positive(message = "A quantidade deve ser maior que zero.")
    private Double quantidade;
    @NotBlank(message = "Selecione a unidade.")
    @Pattern(regexp = "kg|g|litros", message = "Unidade inválida.")
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
