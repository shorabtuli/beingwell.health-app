import SwiftUI

struct ForgotPasswordView: View {
    @EnvironmentObject var authService: AuthService
    @Environment(\.dismiss) var dismiss
    @State private var email = ""
    @State private var showEmailSent = false
    
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
                    // Navigation header
                    HStack {
                        Button("Back") {
                            dismiss()
                        }
                        .foregroundColor(.white)
                        .font(.subheadline)
                        
                        Spacer()
                        
                        Text("Reset Password")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        Spacer()
                        
                        // Invisible spacer for centering
                        Color.clear
                            .frame(width: 50)
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 10)
                    
                    if !showEmailSent {
                        // Reset password form
                        VStack(spacing: 40) {
                            Spacer()
                            
                            VStack(spacing: 20) {
                                Text("Reset Password")
                                    .font(.largeTitle)
                                    .fontWeight(.bold)
                                    .foregroundColor(.white)
                                
                                Text("Enter your email address and we'll send you a link to reset your password")
                                    .font(.body)
                                    .foregroundColor(.white.opacity(0.9))
                                    .multilineTextAlignment(.center)
                                    .padding(.horizontal, 40)
                            }
                            
                            Spacer()
                            
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
                            .padding(.horizontal, 40)
                            
                            // Send reset link button
                            Button(action: {
                                Task {
                                    await authService.forgotPassword(email: email)
                                    showEmailSent = true
                                }
                            }) {
                                HStack {
                                    if authService.isLoading {
                                        ProgressView()
                                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                            .scaleEffect(0.8)
                                    } else {
                                        Text("Send Reset Link")
                                            .fontWeight(.semibold)
                                    }
                                }
                                .frame(maxWidth: .infinity)
                                .frame(height: 50)
                                .background(Color.blue)
                                .foregroundColor(.white)
                                .cornerRadius(25)
                            }
                            .disabled(authService.isLoading || email.isEmpty)
                            .opacity(email.isEmpty ? 0.6 : 1.0)
                            .padding(.horizontal, 40)
                            
                            Spacer()
                        }
                    } else {
                        // Email sent confirmation
                        VStack(spacing: 40) {
                            Spacer()
                            
                            // Email icon
                            ZStack {
                                Circle()
                                    .fill(Color.white.opacity(0.2))
                                    .frame(width: 120, height: 120)
                                
                                Image(systemName: "envelope.fill")
                                    .font(.system(size: 50))
                                    .foregroundColor(.white)
                            }
                            
                            VStack(spacing: 15) {
                                Text("Check Your Email")
                                    .font(.largeTitle)
                                    .fontWeight(.bold)
                                    .foregroundColor(.white)
                                
                                Text("We've sent a password reset link to your email address. Please check your inbox and follow the instructions.")
                                    .font(.body)
                                    .foregroundColor(.white.opacity(0.9))
                                    .multilineTextAlignment(.center)
                                    .padding(.horizontal, 40)
                            }
                            
                            Spacer()
                            
                            // Action buttons
                            VStack(spacing: 15) {
                                Button("Open Email App") {
                                    // In a real app, this would open the email app
                                    print("📧 Opening email app...")
                                }
                                .frame(maxWidth: .infinity)
                                .frame(height: 50)
                                .background(Color.blue)
                                .foregroundColor(.white)
                                .cornerRadius(25)
                                
                                Button("Didn't receive email?") {
                                    showEmailSent = false
                                }
                                .foregroundColor(.white)
                                .font(.subheadline)
                            }
                            .padding(.horizontal, 40)
                            
                            Spacer()
                        }
                    }
                    
                    // Back to login link
                    Button("Back to Login") {
                        dismiss()
                    }
                    .foregroundColor(.white)
                    .font(.subheadline)
                    .padding(.bottom, 20)
                }
            }
        }
        .sheet(isPresented: $authService.showEmailVerification) {
            EmailVerificationView()
                .environmentObject(authService)
        }
    }
}

// Preview removed for Xcode compatibility 