import SwiftUI

struct EmailVerificationView: View {
    @EnvironmentObject var authService: AuthService
    @Environment(\.dismiss) var dismiss
    @State private var verificationCode = ""
    @State private var showError = false
    @State private var errorMessage = ""
    
    var body: some View {
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
            
            VStack(spacing: 40) {
                Spacer()
                
                // Verification icon
                ZStack {
                    Circle()
                        .fill(Color.white.opacity(0.2))
                        .frame(width: 120, height: 120)
                    
                    Image(systemName: "checkmark.shield.fill")
                        .font(.system(size: 50))
                        .foregroundColor(.white)
                }
                
                VStack(spacing: 15) {
                    Text("Enter Verification Code")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                    
                    Text("Please enter the 6-digit code that was sent to your email address")
                        .font(.body)
                        .foregroundColor(.white.opacity(0.9))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 40)
                    
                    // Note about console
                    Text("Note: Check Xcode console for the verification code")
                        .font(.caption)
                        .foregroundColor(.yellow)
                        .padding(.top, 10)
                }
                
                Spacer()
                
                // Verification code input
                VStack(spacing: 20) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Verification Code")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        TextField("Enter 6-digit code", text: $verificationCode)
                            .textFieldStyle(CustomTextFieldStyle())
                            .keyboardType(.numberPad)
                            .onChange(of: verificationCode) { newValue in
                                // Limit to 6 digits
                                if newValue.count > 6 {
                                    verificationCode = String(newValue.prefix(6))
                                }
                            }
                    }
                    .padding(.horizontal, 40)
                    
                    // Error message
                    if showError {
                        Text(errorMessage)
                            .foregroundColor(.red)
                            .font(.caption)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 40)
                    }
                    
                    // Verify button
                    Button(action: {
                        if authService.verifyEmailCode(code: verificationCode) {
                            // Success - reset password
                            print("✅ Password reset successful")
                            dismiss()
                        } else {
                            showError = true
                            errorMessage = "Invalid verification code. Please try again."
                        }
                    }) {
                        Text("Verify Code")
                            .fontWeight(.semibold)
                            .frame(maxWidth: .infinity)
                            .frame(height: 50)
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(25)
                    }
                    .disabled(verificationCode.count != 6)
                    .opacity(verificationCode.count != 6 ? 0.6 : 1.0)
                    .padding(.horizontal, 40)
                    
                    // Resend code button
                    Button("Resend Code") {
                        Task {
                            await authService.forgotPassword(email: "user@example.com")
                        }
                    }
                    .foregroundColor(.white)
                    .font(.subheadline)
                }
                
                Spacer()
                
                // Back to login
                Button("Back to Login") {
                    dismiss()
                }
                .foregroundColor(.white)
                .font(.subheadline)
                .padding(.bottom, 20)
            }
        }
    }
}

// Preview removed for Xcode compatibility 