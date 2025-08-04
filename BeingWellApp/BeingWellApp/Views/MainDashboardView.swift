import SwiftUI

struct MainDashboardView: View {
    @EnvironmentObject var authService: AuthService
    
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
                
                VStack(spacing: 40) {
                    Spacer()
                    
                    VStack(spacing: 20) {
                        Image(systemName: "heart.fill")
                            .font(.system(size: 60))
                            .foregroundColor(.white)
                        
                        Text("Welcome to Being Well!")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                        
                        if let user = authService.currentUser {
                            Text("Hello, \(user.firstName)!")
                                .font(.title2)
                                .foregroundColor(.white.opacity(0.9))
                        }
                        
                        Text("Main dashboard will be implemented in Use Case #6")
                            .font(.body)
                            .foregroundColor(.white.opacity(0.9))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 40)
                    }
                    
                    Spacer()
                    
                    Button("Logout") {
                        authService.logout()
                    }
                    .foregroundColor(.white)
                    .font(.subheadline)
                    .padding(.bottom, 20)
                }
            }
            .navigationBarHidden(true)
        }
    }
}

// Preview removed for Xcode compatibility