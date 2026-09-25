package com.iwms;

import com.iwms.repository.InMemoryStore;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(properties = "iwms.persistence=true")
class PersistenceSystemTest {
    private static final Path DATA_FILE = Path.of(System.getProperty("user.dir"), "data", "iwms-data.json");

    static {
        System.setProperty("iwms.persistence", "true");
    }

    @BeforeEach
    void removePreviousSnapshot() throws Exception {
        Files.deleteIfExists(DATA_FILE);
    }

    @AfterEach
    void removeSnapshot() throws Exception {
        Files.deleteIfExists(DATA_FILE);
        System.clearProperty("iwms.persistence");
    }

    @Test
    void dataSurvivesAStoreRestartWhenPersistenceIsEnabled() throws Exception {
        InMemoryStore firstStore = new InMemoryStore();
        firstStore.products.get(1L).setName("Persisted Laptop");
        firstStore.persist();

        assertTrue(Files.exists(DATA_FILE));

        InMemoryStore restartedStore = new InMemoryStore();

        assertEquals("Persisted Laptop", restartedStore.products.get(1L).getName());
    }
}