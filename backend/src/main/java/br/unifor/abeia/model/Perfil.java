package br.unifor.abeia.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Modelo que representa os dados do Perfil do usuário.
 */
public class Perfil {

    private String id;
    @NotBlank(message = "Informe o nome.")
    private String nome;
    @NotBlank(message = "Informe o e-mail.")
    @Email(message = "Informe um e-mail válido.")
    private String email;
    private String iniciais;
    private String telefone;

    public Perfil() {
    }

    public Perfil(String id, String nome, String email, String iniciais, String telefone) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.iniciais = iniciais;
        this.telefone = telefone;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getIniciais() {
        return iniciais;
    }

    public void setIniciais(String iniciais) {
        this.iniciais = iniciais;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
}
