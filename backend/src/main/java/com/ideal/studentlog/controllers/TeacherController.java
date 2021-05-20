package com.ideal.studentlog.controllers;

import com.ideal.studentlog.database.models.Teacher;
import com.ideal.studentlog.helpers.dataclass.TeacherDTO;
import com.ideal.studentlog.helpers.exceptions.ServiceException;
import com.ideal.studentlog.services.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(path = "/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService service;

    @GetMapping
    public List<TeacherDTO> getAll() {
        return service.getAll();
    }

    @GetMapping(path = "/{id}")
    public TeacherDTO getById(@PathVariable("id") Integer id) throws ServiceException {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @RolesAllowed("ROLE_ADMIN")
    public TeacherDTO create(@RequestBody @Valid TeacherDTO dto) {
        return service.create(dto);
    }

    @PatchMapping(path = "/{id}")
    @RolesAllowed({"ROLE_TEACHER","ROLE_ADMIN"})
    public TeacherDTO update(@PathVariable("id") Integer id, @RequestBody @Valid TeacherDTO dto) throws ServiceException {
        return service.update(id, dto);
    }

    @DeleteMapping(path = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Integer id) {
        service.delete(id);
    }
}
