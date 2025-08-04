import SwiftUI

struct ContentView: View {
    @StateObject private var authService = AuthService()
    
    var body: some View {
        Group {
            if !authService.isAuthenticated {
                LoginView()
                    .environmentObject(authService)
            } else {
                MainDashboardView()
                    .environmentObject(authService)
            }
        }
        .animation(.easeInOut, value: authService.isAuthenticated)
    }
}

#Preview {
    ContentView()
} 