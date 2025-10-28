package signlens.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import signlens.backend.config.JwtTokenUtil;
import signlens.backend.dao.dto.AppUserDto;
import signlens.backend.dao.dto.JwtRequest;
import signlens.backend.dao.dto.JwtResponse;
import signlens.backend.service.impl.JwtUserDetailsService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class JwtAuthenticationControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenUtil jwtTokenUtil;

    @Mock
    private UserDetailsService jwtInMemoryUserDetailsService;

    @Mock
    private JwtUserDetailsService userDetailsService;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private JwtAuthenticationController jwtAuthenticationController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(jwtAuthenticationController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void testCreateAuthenticationToken_Success() throws Exception {
        // Arrange
        JwtRequest authRequest = new JwtRequest("testuser", "password123");
        AppUserDto userDto = new AppUserDto();
        userDto.setUsername("testuser");
        userDto.setName("Test User");
        userDto.setUserId(1);
        
        String expectedToken = "jwt-token-123";
        
        when(jwtInMemoryUserDetailsService.loadUserByUsername("testuser")).thenReturn(userDetails);
        when(jwtTokenUtil.generateToken(userDetails)).thenReturn(expectedToken);
        when(userDetailsService.findUserByUsername("testuser")).thenReturn(userDto);
        doNothing().when(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

        // Act & Assert
        mockMvc.perform(post("/authenticate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(expectedToken))
                .andExpect(jsonPath("$.userDto.username").value("testuser"));
    }

    @Test
    void testCreateAuthenticationToken_InvalidCredentials() throws Exception {
        // Arrange
        JwtRequest authRequest = new JwtRequest("testuser", "wrongpassword");
        
        doThrow(new BadCredentialsException("Invalid credentials"))
                .when(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

        // Act & Assert
        mockMvc.perform(post("/authenticate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    void testCreateAuthenticationToken_DisabledUser() throws Exception {
        // Arrange
        JwtRequest authRequest = new JwtRequest("disableduser", "password123");
        
        doThrow(new DisabledException("User disabled"))
                .when(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

        // Act & Assert
        mockMvc.perform(post("/authenticate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    void testSaveUser_Success() throws Exception {
        // Arrange
        AppUserDto userDto = new AppUserDto();
        userDto.setUsername("newuser");
        userDto.setName("New User");
        userDto.setEmail("newuser@example.com");
        userDto.setPassword("password123");
        
        AppUserDto savedUserDto = new AppUserDto();
        savedUserDto.setUserId(1);
        savedUserDto.setUsername("newuser");
        savedUserDto.setName("New User");
        savedUserDto.setEmail("newuser@example.com");
        
        when(userDetailsService.save(any(AppUserDto.class))).thenReturn(null);

        // Act & Assert
        mockMvc.perform(post("/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isOk());
    }

    @Test
    void testSaveUser_ServiceException() throws Exception {
        // Arrange
        AppUserDto userDto = new AppUserDto();
        userDto.setUsername("newuser");
        userDto.setName("New User");
        userDto.setEmail("newuser@example.com");
        userDto.setPassword("password123");
        
        when(userDetailsService.save(any(AppUserDto.class))).thenThrow(new RuntimeException("User already exists"));

        // Act & Assert
        mockMvc.perform(post("/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    void testAuthenticate_Success() throws Exception {
        // Test the authenticate method directly
        String username = "testuser";
        String password = "password123";
        
        doNothing().when(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        
        // This would be called within createAuthenticationToken, no direct way to test private method
        // but we can verify through the public method
        JwtRequest authRequest = new JwtRequest(username, password);
        AppUserDto userDto = new AppUserDto();
        userDto.setUsername(username);
        
        when(jwtInMemoryUserDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
        when(jwtTokenUtil.generateToken(userDetails)).thenReturn("token");
        when(userDetailsService.findUserByUsername(username)).thenReturn(userDto);

        mockMvc.perform(post("/authenticate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk());
        
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void testCreateAuthenticationToken_NullUsername() throws Exception {
        // Arrange
        JwtRequest authRequest = new JwtRequest(null, "password123");

        // Act & Assert
        mockMvc.perform(post("/authenticate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    void testCreateAuthenticationToken_NullPassword() throws Exception {
        // Arrange
        JwtRequest authRequest = new JwtRequest("testuser", null);

        // Act & Assert
        mockMvc.perform(post("/authenticate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    void testRegister_EmptyUserData() throws Exception {
        // Arrange
        AppUserDto userDto = new AppUserDto();
        // Empty user data
        
        when(userDetailsService.save(any(AppUserDto.class))).thenThrow(new IllegalArgumentException("Required fields missing"));

        // Act & Assert
        mockMvc.perform(post("/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    void testAuthenticate_VerifyTokenGeneration() {
        // Arrange
        String username = "testuser";
        String password = "password123";
        String expectedToken = "generated-jwt-token";
        AppUserDto userDto = new AppUserDto();
        userDto.setUsername(username);
        userDto.setUserId(1);

        try {
            when(jwtInMemoryUserDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
            when(jwtTokenUtil.generateToken(userDetails)).thenReturn(expectedToken);
            when(userDetailsService.findUserByUsername(username)).thenReturn(userDto);
            doNothing().when(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

            JwtRequest authRequest = new JwtRequest(username, password);
            
            // Act
            ResponseEntity<?> response = jwtAuthenticationController.createAuthenticationToken(authRequest);
            
            // Assert
            assertNotNull(response);
            assertEquals(200, response.getStatusCodeValue());
            assertTrue(response.getBody() instanceof JwtResponse);
            
            JwtResponse jwtResponse = (JwtResponse) response.getBody();
            assertEquals(expectedToken, jwtResponse.getToken());
            assertEquals(userDto, jwtResponse.getUserDto());
            
        } catch (Exception e) {
            fail("Exception should not be thrown: " + e.getMessage());
        }
    }
}