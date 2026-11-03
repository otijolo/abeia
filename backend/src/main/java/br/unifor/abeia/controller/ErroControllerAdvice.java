package br.unifor.abeia.controller;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

/** Mensagens de validação usadas pelos formulários do frontend. */
@RestControllerAdvice
public class ErroControllerAdvice {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> validar(MethodArgumentNotValidException error) {
        String mensagem = error.getBindingResult().getFieldErrors().stream()
                .map(campo -> campo.getDefaultMessage()).findFirst().orElse("Dados inválidos.");
        return ResponseEntity.badRequest().body(Map.of("mensagem", mensagem));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> responder(ResponseStatusException error) {
        return ResponseEntity.status(error.getStatusCode())
                .body(Map.of("mensagem", error.getReason() == null ? "Não foi possível concluir a operação." : error.getReason()));
    }
}
