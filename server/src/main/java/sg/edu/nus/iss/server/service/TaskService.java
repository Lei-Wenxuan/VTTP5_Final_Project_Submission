package sg.edu.nus.iss.server.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import sg.edu.nus.iss.server.model.Task;
import sg.edu.nus.iss.server.model.User;
import sg.edu.nus.iss.server.repository.TaskRepository;

@Service
@Transactional
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public List<Task> getTasksByUser(User user) {
        return taskRepository.findByUser(user);
    }

    public Task updateTask(Long taskId, Task updatedTask) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new EntityNotFoundException("Task not found"));
        task.setStart(updatedTask.getStart());
        task.setEnd(updatedTask.getEnd());
        task.setTitle(updatedTask.getTitle());
        task.setAllDay(updatedTask.isAllDay());
        task.setResizable(updatedTask.isResizable());
        task.setTags(updatedTask.getTags());
        task.setBody(updatedTask.getBody());
        task.setComplete(updatedTask.isComplete());
        return taskRepository.saveAndFlush(task);
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }
}