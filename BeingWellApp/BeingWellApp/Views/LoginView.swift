import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authService: AuthService
    @State private var email = ""
    @State private var password = ""
    @State private var rememberMe = false
    @State private var showPassword = false
    @State private var showRegistration = false
    
    var body: some View {
        NavigationView {
            ZStack {
                // Blue gradient background
                LinearGradient(
                    gradient: Gradient(colors: [
                        Color(red: 0.2, green: 0.4, blue: 0.8),
                        Color(red: 0.1, green: 0.3, blue: 0.7)
                    ]),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Status bar spacer
                    Color.clear
                        .frame(height: 44)
                    
                    // Main content
                    VStack(spacing: 40) {
                        Spacer()
                        
                        // Logo and welcome text
                        VStack(spacing: 20) {
                            // Heart-in-hands logo
                            ZStack {
                                Circle()
                                    .fill(Color.green)
                                    .frame(width: 80, height: 80)
                                
                                Image(systemName: "heart.fill")
                                    .font(.system(size: 40))
                                    .foregroundColor(.yellow)
                            }
                            
                            Text("Welcome to")
                                .font(.title2)
                                .foregroundColor(.white)
                            
                            Text("Being Well")
                                .font(.largeTitle)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                        }
                        
                        Spacer()
                        
                        // Login form
                        VStack(spacing: 20) {
                            // Email field
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Email Address")
                                    .font(.headline)
                                    .foregroundColor(.white)
                                
                                TextField("", text: $email)
                                    .textFieldStyle(CustomTextFieldStyle())
                                    .keyboardType(.emailAddress)
                                    .autocapitalization(.none)
                                    .autocorrectionDisabled()
                            }
                            
                            // Password field
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Password")
                                    .font(.headline)
                                    .foregroundColor(.white)
                                
                                HStack {
                                    if showPassword {
                                        TextField("", text: $password)
                                    } else {
                                        SecureField("", text: $password)
                                    }
                                    
                                    Button(action: {
                                        showPassword.toggle()
                                    }) {
                                        Image(systemName: showPassword ? "eye.slash.fill" : "eye.fill")
                                            .foregroundColor(.white.opacity(0.7))
                                    }
                                }
                                .textFieldStyle(CustomTextFieldStyle())
                            }
                            
                            // Remember me checkbox
                            HStack {
                                Button(action: {
                                    rememberMe.toggle()
                                }) {
                                    HStack(spacing: 8) {
                                        Image(systemName: rememberMe ? "checkmark.square.fill" : "square")
                                            .foregroundColor(.white)
                                            .font(.title3)
                                        
                                        Text("Remember Me")
                                            .foregroundColor(.white)
                                            .font(.subheadline)
                                    }
                                }
                                .buttonStyle(PlainButtonStyle())
                                
                                Spacer()
                            }
                            
                            // Error message
                            if let errorMessage = authService.errorMessage {
                                Text(errorMessage)
                                    .foregroundColor(.red)
                                    .font(.caption)
                                    .multilineTextAlignment(.center)
                                    .padding(.horizontal)
                            }
                            
                            // Login button
                            Button(action: {
                                Task {
                                    await authService.login(email: email, password: password)
                                }
                            }) {
                                HStack {
                                    if authService.isLoading {
                                        ProgressView()
                                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                            .scaleEffect(0.8)
                                    } else {
                                        Text("Log In")
                                            .fontWeight(.semibold)
                                    }
                                }
                                .frame(maxWidth: .infinity)
                                .frame(height: 50)
                                .background(Color.white)
                                .foregroundColor(.blue)
                                .cornerRadius(25)
                            }
                            .disabled(authService.isLoading || email.isEmpty || password.isEmpty)
                            .opacity((email.isEmpty || password.isEmpty) ? 0.6 : 1.0)
                            
                            // Links
                            VStack(spacing: 15) {
                                Button("Forgot Password?") {
                                    authService.showForgotPassword = true
                                }
                                .foregroundColor(.white)
                                .font(.subheadline)
                                
                                HStack(spacing: 5) {
                                    Text("New user?")
                                        .foregroundColor(.white)
                                        .font(.subheadline)
                                    
                                    Button("Sign up") {
                                        showRegistration = true
                                    }
                                    .foregroundColor(.white)
                                    .font(.subheadline)
                                    .underline()
                                }
                            }
                        }
                        .padding(.horizontal, 40)
                        
                        Spacer()
                    }
                }
            }
        }
        .sheet(isPresented: $authService.showForgotPassword) {
            ForgotPasswordView()
                .environmentObject(authService)
        }
        .sheet(isPresented: $showRegistration) {
            RegistrationView()
                .environmentObject(authService)
        }
        .onAppear {
            // Check if biometric login is available
            if authService.checkBiometricAvailability() {
                authService.showBiometricLogin = true
            }
        }
        .sheet(isPresented: $authService.showBiometricLogin) {
            BiometricLoginView()
                .environmentObject(authService)
        }
    }
}

struct CustomTextFieldStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .padding()
            .background(Color.white)
            .cornerRadius(10)
            .foregroundColor(.black)
    }
}

// Preview removed for Xcode compatibility 