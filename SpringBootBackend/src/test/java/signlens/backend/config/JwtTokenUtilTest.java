package signlens.backend.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;
import io.jsonwebtoken.Claims;

import java.lang.reflect.Field;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtTokenUtilTest {

    @InjectMocks
    private JwtTokenUtil jwtTokenUtil;

    @Mock
    private UserDetails userDetails;

    @BeforeEach
    void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
        // Ensure secret is set so JWT signing/parsing works in tests
        Field secretField = JwtTokenUtil.class.getDeclaredField("secret");
        secretField.setAccessible(true);
        secretField.set(jwtTokenUtil, "testsecret");
    }

    @Test
    void testGenerateToken() {
        // Arrange
        when(userDetails.getUsername()).thenReturn("testuser");

        // Act
        String token = jwtTokenUtil.generateToken(userDetails);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.length() > 0);
    }

    @Test
    void testGetUsernameFromToken() {
        // Arrange
        when(userDetails.getUsername()).thenReturn("testuser");
        String token = jwtTokenUtil.generateToken(userDetails);

        // Act
        String username = jwtTokenUtil.getUsernameFromToken(token);

        // Assert
        assertEquals("testuser", username);
    }

    @Test
    void testGetExpirationDateFromToken() {
        // Arrange
        when(userDetails.getUsername()).thenReturn("testuser");
        String token = jwtTokenUtil.generateToken(userDetails);

        // Act
        Date expirationDate = jwtTokenUtil.getExpirationDateFromToken(token);

        // Assert
        assertNotNull(expirationDate);
        assertTrue(expirationDate.after(new Date()));
    }

    @Test
    void testValidateToken_ValidToken() {
        // Arrange
        when(userDetails.getUsername()).thenReturn("testuser");
        String token = jwtTokenUtil.generateToken(userDetails);

        // Act
        Boolean isValid = jwtTokenUtil.validateToken(token, userDetails);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void testValidateToken_InvalidUsername() {
        // Arrange
        when(userDetails.getUsername()).thenReturn("testuser");
        String token = jwtTokenUtil.generateToken(userDetails);
        
        UserDetails differentUser = mock(UserDetails.class);
        when(differentUser.getUsername()).thenReturn("differentuser");

        // Act
        Boolean isValid = jwtTokenUtil.validateToken(token, differentUser);

        // Assert
        assertFalse(isValid);
    }

    // Removed tests for private or non-existent methods to avoid compilation errors

    @Test
    void testCanTokenBeRefreshed_NonExpiredToken() {
        // Arrange
        when(userDetails.getUsername()).thenReturn("testuser");
        String token = jwtTokenUtil.generateToken(userDetails);

        // Act
        Boolean canRefresh = jwtTokenUtil.canTokenBeRefreshed(token);

        // Assert
        assertTrue(canRefresh);
    }


    @Test
    void testGetClaimFromToken() {
        // Arrange
        when(userDetails.getUsername()).thenReturn("testuser");
        String token = jwtTokenUtil.generateToken(userDetails);

        // Act
        String username = jwtTokenUtil.getClaimFromToken(token, Claims::getSubject);

        // Assert
        assertEquals("testuser", username);
    }

    @Test
    void testTokenExpiration() {
        // Arrange
        when(userDetails.getUsername()).thenReturn("testuser");
        String token = jwtTokenUtil.generateToken(userDetails);

        // Act
        Date expirationDate = jwtTokenUtil.getExpirationDateFromToken(token);
        Date issuedDate = new Date();

        // Assert
        assertTrue(expirationDate.after(issuedDate));
        
        // Check that expiration is approximately 5 hours from now (default JWT expiration)
        long timeDifference = expirationDate.getTime() - issuedDate.getTime();
        assertTrue(timeDifference > 0);
        assertTrue(timeDifference <= 18000000L); // 5 hours in milliseconds
    }

    

    @Test
    void testNullToken() {
        // Act & Assert
        assertThrows(Exception.class, () -> {
            jwtTokenUtil.getUsernameFromToken(null);
        });
    }

    @Test
    void testEmptyToken() {
        // Act & Assert
        assertThrows(Exception.class, () -> {
            jwtTokenUtil.getUsernameFromToken("");
        });
    }

    @Test
    void testInvalidToken() {
        // Act & Assert
        assertThrows(Exception.class, () -> {
            jwtTokenUtil.getUsernameFromToken("invalid.token.here");
        });
    }

    @Test
    void testTokenConsistency() {
        // Arrange
        when(userDetails.getUsername()).thenReturn("consistencytest");
        
        // Act
        String token1 = jwtTokenUtil.generateToken(userDetails);
        String token2 = jwtTokenUtil.generateToken(userDetails);

        // Assert
        // Tokens should be different (due to timestamp) but usernames should be the same
        assertNotEquals(token1, token2);
        assertEquals(jwtTokenUtil.getUsernameFromToken(token1), jwtTokenUtil.getUsernameFromToken(token2));
    }
}