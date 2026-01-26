import Foundation
import SwiftUI

class APIService {
    static let shared = APIService()
    
    // Change this to your local IP if running on device, or localhost for simulator
    // For iOS Simulator: http://localhost:4000
    // For iOS Simulator: Use LAN IP due to localhost issues
    private let baseURL = "http://192.168.29.193:4000/api" 
    
    func fetchLayout(slug: String) async throws -> AdvancedLayoutResponse? {
        guard let url = URL(string: "\(baseURL)/advanced-layout/\(slug)") else {
            throw APIError.invalidURL
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse, 
              (200...299).contains(httpResponse.statusCode) else {
            throw APIError.serverError
        }
        
        do {
            let decodedResponse = try JSONDecoder().decode(AdvancedLayoutResponse.self, from: data)
            return decodedResponse
        } catch {
            print("Decoding Error: \(error)")
            // Print JSON string for debugging
            if let jsonString = String(data: data, encoding: .utf8) {
                print("Received JSON: \(jsonString)")
            }
            throw APIError.decodingError
        }
    }
    
    func fetchProducts(limit: Int = 20) async throws -> [Product] {
        guard let url = URL(string: "\(baseURL)/products?limit=\(limit)") else {
            throw APIError.invalidURL
        }
        
        let (data, response) = try await URLSession.shared.data(for: URLRequest(url: url))
        
        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            throw APIError.serverError
        }
        
        // Handle different response structures (array vs object with products key)
        if let products = try? JSONDecoder().decode([Product].self, from: data) {
            return products
        } else {
            struct ProductResponse: Decodable {
                let products: [Product]
            }
            let res = try JSONDecoder().decode(ProductResponse.self, from: data)
            return res.products
        }
    }
}

struct AdvancedLayoutResponse: Decodable {
    let slug: String
    let name: String
    let isActive: Bool
    let components: [SDUIComponent]
}

enum APIError: Error {
    case invalidURL
    case serverError
    case decodingError
}
