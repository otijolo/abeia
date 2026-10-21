package br.unifor.abeia.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Modelo que representa um Alerta na arquitetura MVC.
 */
public class Alerta {

    private String id;
    private String titulo;
    private String tituloDetalhe;
    private String origem;
    private String quando;
    private String data;
    private String status; // normal, atencao, critico
    private String estado; // ativo, resolvido, ignorado
    private String motivo;
    private List<String> afetados = new ArrayList<>();
    private String colmeiaId;

    public Alerta() {
    }

    public Alerta(String id, String titulo, String tituloDetalhe, String origem, String quando,
                  String data, String status, String estado, String motivo, List<String> afetados, String colmeiaId) {
        this.id = id;
        this.titulo = titulo;
        this.tituloDetalhe = tituloDetalhe;
        this.origem = origem;
        this.quando = quando;
        this.data = data;
        this.status = status;
        this.estado = estado;
        this.motivo = motivo;
        this.afetados = afetados != null ? afetados : new ArrayList<>();
        this.colmeiaId = colmeiaId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getTituloDetalhe() {
        return tituloDetalhe;
    }

    public void setTituloDetalhe(String tituloDetalhe) {
        this.tituloDetalhe = tituloDetalhe;
    }

    public String getOrigem() {
        return origem;
    }

    public void setOrigem(String origem) {
        this.origem = origem;
    }

    public String getQuando() {
        return quando;
    }

    public void setQuando(String quando) {
        this.quando = quando;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public List<String> getAfetados() {
        return afetados;
    }

    public void setAfetados(List<String> afetados) {
        this.afetados = afetados;
    }

    public String getColmeiaId() {
        return colmeiaId;
    }

    public void setColmeiaId(String colmeiaId) {
        this.colmeiaId = colmeiaId;
    }
}
