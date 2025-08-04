import Foundation

struct User: Codable, Identifiable {
    var id = UUID()
    var firstName: String
    var lastName: String
    var email: String
    var password: String // In production, this should be hashed
    
    var fullName: String {
        "\(firstName) \(lastName)"
    }
}

// Preview removed for Xcode compatibility 