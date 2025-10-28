package signlens.backend.dao.domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AppUserTest {

    private AppUser appUser;

    @BeforeEach
    void setUp() {
        appUser = new AppUser();
    }

    @Test
    void testAppUserSettersAndGetters() {
        // Arrange
        Integer userId = 1;
        String username = "testuser";
        String name = "Test User";
        String email = "test@example.com";
        Integer userRole = 1;
        String password = "hashedPassword123";

        // Act
        appUser.setUserId(userId);
        appUser.setUsername(username);
        appUser.setName(name);
        appUser.setEmail(email);
        appUser.setUserRole(userRole);
        appUser.setPassword(password);

        // Assert
        assertEquals(userId, appUser.getUserId());
        assertEquals(username, appUser.getUsername());
        assertEquals(name, appUser.getName());
        assertEquals(email, appUser.getEmail());
        assertEquals(userRole, appUser.getUserRole());
        assertEquals(password, appUser.getPassword());
    }

    @Test
    void testAppUserDefaultValues() {
        // Assert - all fields should be null by default
        assertNull(appUser.getUserId());
        assertNull(appUser.getUsername());
        assertNull(appUser.getName());
        assertNull(appUser.getEmail());
        assertNull(appUser.getUserRole());
        assertNull(appUser.getPassword());
    }

    @Test
    void testAppUserWithNullValues() {
        // Act
        appUser.setUserId(null);
        appUser.setUsername(null);
        appUser.setName(null);
        appUser.setEmail(null);
        appUser.setUserRole(null);
        appUser.setPassword(null);

        // Assert
        assertNull(appUser.getUserId());
        assertNull(appUser.getUsername());
        assertNull(appUser.getName());
        assertNull(appUser.getEmail());
        assertNull(appUser.getUserRole());
        assertNull(appUser.getPassword());
    }

    @Test
    void testAppUserWithEmptyStrings() {
        // Act
        appUser.setUsername("");
        appUser.setName("");
        appUser.setEmail("");
        appUser.setPassword("");

        // Assert
        assertEquals("", appUser.getUsername());
        assertEquals("", appUser.getName());
        assertEquals("", appUser.getEmail());
        assertEquals("", appUser.getPassword());
    }

    @Test
    void testAppUserWithSpecialCharacters() {
        // Arrange
        String specialUsername = "test@user#123";
        String specialName = "Test User (Admin)";
        String specialEmail = "test+admin@example-domain.com";
        String specialPassword = "P@ssw0rd!123";

        // Act
        appUser.setUsername(specialUsername);
        appUser.setName(specialName);
        appUser.setEmail(specialEmail);
        appUser.setPassword(specialPassword);

        // Assert
        assertEquals(specialUsername, appUser.getUsername());
        assertEquals(specialName, appUser.getName());
        assertEquals(specialEmail, appUser.getEmail());
        assertEquals(specialPassword, appUser.getPassword());
    }

    @Test
    void testAppUserRoleValues() {
        // Test different user role values
        appUser.setUserRole(0); // Guest
        assertEquals(Integer.valueOf(0), appUser.getUserRole());

        appUser.setUserRole(1); // Regular User
        assertEquals(Integer.valueOf(1), appUser.getUserRole());

        appUser.setUserRole(2); // Admin
        assertEquals(Integer.valueOf(2), appUser.getUserRole());

        appUser.setUserRole(-1); // Invalid role
        assertEquals(Integer.valueOf(-1), appUser.getUserRole());
    }

    @Test
    void testAppUserLongValues() {
        // Test with longer string values
        StringBuilder longUsernameBuilder = new StringBuilder();
        for (int i = 0; i < 100; i++) {
            longUsernameBuilder.append("a");
        }
        String longUsername = longUsernameBuilder.toString();
        
        String longName = "Test User with a Very Long Name That Exceeds Normal Length";
        String longEmail = "verylongemailaddress@verylongdomainnameverylongdomainname.com";
        
        appUser.setUsername(longUsername);
        appUser.setName(longName);
        appUser.setEmail(longEmail);

        assertEquals(longUsername, appUser.getUsername());
        assertEquals(longName, appUser.getName());
        assertEquals(longEmail, appUser.getEmail());
    }

    @Test
    void testAppUserEquality() {
        // Create two AppUser instances with same data
        AppUser user1 = new AppUser();
        user1.setUserId(1);
        user1.setUsername("testuser");
        user1.setName("Test User");
        user1.setEmail("test@example.com");
        user1.setUserRole(1);
        user1.setPassword("password123");

        AppUser user2 = new AppUser();
        user2.setUserId(1);
        user2.setUsername("testuser");
        user2.setName("Test User");
        user2.setEmail("test@example.com");
        user2.setUserRole(1);
        user2.setPassword("password123");

        // Note: Since equals() is not overridden, this will test reference equality
        assertNotEquals(user1, user2); // Different object references
        
        // Test individual field equality
        assertEquals(user1.getUserId(), user2.getUserId());
        assertEquals(user1.getUsername(), user2.getUsername());
        assertEquals(user1.getName(), user2.getName());
        assertEquals(user1.getEmail(), user2.getEmail());
        assertEquals(user1.getUserRole(), user2.getUserRole());
        assertEquals(user1.getPassword(), user2.getPassword());
    }

    @Test
    void testAppUserChainedSetters() {
        // Test that setters can be chained (if they return 'this')
        // Note: Current implementation doesn't support chaining, but testing individual calls
        appUser.setUserId(1);
        appUser.setUsername("chaineduser");
        appUser.setName("Chained User");
        
        assertEquals(Integer.valueOf(1), appUser.getUserId());
        assertEquals("chaineduser", appUser.getUsername());
        assertEquals("Chained User", appUser.getName());
    }
}