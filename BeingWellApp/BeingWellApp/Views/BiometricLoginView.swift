import SwiftUI
import LocalAuthentication

struct BiometricLoginView: View {
    @EnvironmentObject var authService: AuthService
    @Environment(\.dismiss) var dismiss
    
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
                
                // Biometric icon
                ZStack {
                    Circle()
                        .fill(Color.blue.opacity(0.3))
                        .frame(width: 120, height: 120)
                    
                    Image(systemName: "hand.raised.fill")
                        .font(.system(size: 50))
                        .foregroundColor(.yellow)
                }
                
                // Title and description
                VStack(spacing: 15) {
                    Text("Quick Login")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                    
                    Text("Use Touch ID or Face ID for faster, easier access to your wellness plan")
                        .font(.body)
                        .foregroundColor(.white.opacity(0.9))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 40)
                }
                
                Spacer()
                
                // Action buttons
                VStack(spacing: 15) {
                    Button(action: {
                        Task {
                            await authService.authenticateWithBiometrics()
                        }
                    }) {
                        HStack {
                            Image(systemName: "touchid")
                                .font(.title2)
                            Text("Use Touch ID")
                                .fontWeight(.semibold)
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 50)
                        .background(Color.white)
                        .foregroundColor(.blue)
                        .cornerRadius(25)
                    }
                    
                    Button("Use Password Instead") {
                        dismiss()
                    }
                    .foregroundColor(.white)
                    .font(.subheadline)
                }
                .padding(.horizontal, 40)
                
                Spacer()
            }
        }
    }
}

// Preview removed for Xcode compatibility 