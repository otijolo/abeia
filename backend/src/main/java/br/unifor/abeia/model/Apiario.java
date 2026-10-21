package br.unifor.abeia.model;

/**
 * Modelo que representa um Apiário na arquitetura MVC.
 */
public class Apiario {

    private String id;
    private String nome;
    private String cidade;
    private String uf;
    private String descricao;
    private String vegetacao;
    private Boolean fonteAgua;
    private String latitude;
    private String longitude;
    private String observacoes;
    private Integer totalColmeias;
    private String status; // normal, atencao, critico

    public Apiario() {
    }

    public Apiario(String id, String nome, String cidade, String uf, String descricao,
                   String vegetacao, Boolean fonteAgua, String latitude, String longitude,
                   String observacoes, Integer totalColmeias, String status) {
        this.id = id;
        this.nome = nome;
        this.cidade = cidade;
        this.uf = uf;
        this.descricao = descricao;
        this.vegetacao = vegetacao;
        this.fonteAgua = fonteAgua;
        this.latitude = latitude;
        this.longitude = longitude;
        this.observacoes = observacoes;
        this.totalColmeias = totalColmeias != null ? totalColmeias : 0;
        this.status = status != null ? status : "normal";
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

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getUf() {
        return uf;
    }

    public void setUf(String uf) {
        this.uf = uf;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getVegetacao() {
        return vegetacao;
    }

    public void setVegetacao(String vegetacao) {
        this.vegetacao = vegetacao;
    }

    public Boolean getFonteAgua() {
        return fonteAgua;
    }

    public void setFonteAgua(Boolean fonteAgua) {
        this.fonteAgua = fonteAgua;
    }

    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public Integer getTotalColmeias() {
        return totalColmeias;
    }

    public void setTotalColmeias(Integer totalColmeias) {
        this.totalColmeias = totalColmeias;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
