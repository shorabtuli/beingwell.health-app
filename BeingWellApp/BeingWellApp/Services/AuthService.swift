import Foundation
import SwiftUI
import LocalAuthentication

class AuthService: ObservableObject {
    @Published var isAuthenticated = false
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var currentUser: User?
    @Published var showBiometricLogin = false
    @Published var showForgotPassword = false
    @Published var showEmailVerification = false
    @Published var verificationCode: String = ""
    
    // In a real app, this would be stored securely
    private var users: [User] = []
    
    init() {
        // Add a test user for development
        let testUser = User(
            firstName: "Sarah",
            lastName: "Johnson",
            email: "sarah@example.com",
            password: "password123"
        )
        users.append(testUser)
    }
    
    func login(email: String, password: String) async {
        DispatchQueue.main.async {
            self.isLoading = true
            self.errorMessage = nil
        }
        
        // Simulate network delay
        try? await Task.sleep(nanoseconds: 1_000_000_000)
        
        DispatchQueue.main.async {
            self.isLoading = false
            
            if let user = self.users.first(where: { $0.email == email && $0.password == password }) {
                self.currentUser = user
                self.isAuthenticated = true
                print("✅ Login successful for: \(user.email)")
            } else {
                self.errorMessage = "Email or password is incorrect. Please try again."
                print("❌ Login failed for: \(email)")
            }
        }
    }
    
    func checkBiometricAvailability() -> Bool {
        let context = LAContext()
        var error: NSError?
        
        if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
            return true
        }
        return false
    }
    
    func authenticateWithBiometrics() async {
        let context = LAContext()
        let reason = "Log in to Being Well"
        
        do {
            let success = try await context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason)
            
            DispatchQueue.main.async {
                if success {
                    // For demo purposes, authenticate with the test user
                    self.currentUser = self.users.first
                    self.isAuthenticated = true
                    print("✅ Biometric authentication successful")
                } else {
                    self.errorMessage = "Biometric authentication failed"
                    print("❌ Biometric authentication failed")
                }
            }
        } catch {
            DispatchQueue.main.async {
                self.errorMessage = "Biometric authentication failed: \(error.localizedDescription)"
                print("❌ Biometric authentication error: \(error.localizedDescription)")
            }
        }
    }
    
    func forgotPassword(email: String) async {
        DispatchQueue.main.async {
            self.isLoading = true
            self.errorMessage = nil
        }
        
        // Simulate network delay
        try? await Task.sleep(nanoseconds: 1_500_000_000)
        
        DispatchQueue.main.async {
            self.isLoading = false
            
            // Generate a verification code
            let code = String(format: "%06d", Int.random(in: 100000...999999))
            self.verificationCode = code
            self.showEmailVerification = true
            
            print("📧 Password reset email sent to: \(email)")
            print("🔐 Verification code: \(code)")
        }
    }
    
    func verifyEmailCode(code: String) -> Bool {
        let isValid = code == verificationCode
        if isValid {
            print("✅ Email verification successful")
        } else {
            print("❌ Invalid verification code")
        }
        return isValid
    }
    
    func logout() {
        currentUser = nil
        isAuthenticated = false
        print("👋 User logged out")
    }
} 