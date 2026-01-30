import CoreLocation
import MapKit
import SwiftUI

// MARK: - Location Picker View
public struct LocationPickerView: View {
    @Environment(\.presentationMode) var presentationMode
    @StateObject private var locationManager = LocationManager()

    // Steps
    enum Step {
        case mapSelect
        case detailsForm
    }

    @State private var step: Step = .mapSelect
    @State private var isMapActive = false
    @State private var regionName = "Locating..."
    @State private var fullAddress = ""
    @State private var isLoading = false

    // Map Region
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 21.1458, longitude: 79.0882),  // Nagpur default
        span: MKCoordinateSpan(latitudeDelta: 0.01, longitudeDelta: 0.01)
    )

    // Form State
    @State private var name = ""
    @State private var phone = ""
    @State private var pincode = ""
    @State private var addressLine1 = ""
    @State private var addressLine2 = ""
    @State private var city = ""
    @State private var state = ""
    @State private var landmark = ""

    // Callback when address is saved
    var onAddressSelected: ((UserAddress) -> Void)?

    public var body: some View {
        NavigationView {
            Group {
                if step == .mapSelect {
                    mapSelectionView
                } else {
                    detailsFormView
                }
            }
            .navigationBarHidden(true)
        }
        .onAppear {
            // Request location on appear
            locationManager.startUpdating()
        }
        .onChange(of: locationManager.location) { newLocation in
            if let location = newLocation {
                region = MKCoordinateRegion(
                    center: location.coordinate,
                    span: MKCoordinateSpan(latitudeDelta: 0.005, longitudeDelta: 0.005)
                )
                reverseGeocode(location: location)
            }
        }
    }

    // MARK: - Map Selection View
    private var mapSelectionView: some View {
        ZStack {
            // Map
            Map(coordinateRegion: $region, showsUserLocation: true)
                .edgesIgnoringSafeArea(.all)
                .disabled(!isMapActive)
                .onChange(of: region.center.latitude) { _ in
                    if isMapActive {
                        reverseGeocodeCenter()
                    }
                }

            // Dark overlay when inactive
            if !isMapActive {
                Color.black.opacity(0.3)
                    .edgesIgnoringSafeArea(.all)
            }

            // Center Pin
            VStack(spacing: 0) {
                // Tooltip
                Text("Place pin on the exact location")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.white)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(Color.black)
                    .cornerRadius(4)

                // Arrow
                Triangle()
                    .fill(Color.black)
                    .frame(width: 12, height: 6)

                // Pin
                Image(systemName: "mappin.circle.fill")
                    .font(.system(size: 48))
                    .foregroundColor(Color(hex: "#2563EB"))

                // Shadow
                Ellipse()
                    .fill(Color.black.opacity(0.5))
                    .frame(width: 12, height: 4)
                    .offset(y: -4)

                // Area Tag
                Text(regionName)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(Color(hex: "#2563EB"))
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(Color.white)
                    .overlay(
                        RoundedRectangle(cornerRadius: 4)
                            .stroke(Color(hex: "#2563EB"), lineWidth: 1)
                    )
                    .cornerRadius(4)
                    .shadow(color: .black.opacity(0.1), radius: 2)
                    .padding(.top, 6)
            }
            .offset(y: -60)

            // Floating recenter button (only when active)
            if isMapActive {
                VStack {
                    Spacer()

                    Button(action: {
                        if let location = locationManager.location {
                            region = MKCoordinateRegion(
                                center: location.coordinate,
                                span: MKCoordinateSpan(latitudeDelta: 0.005, longitudeDelta: 0.005)
                            )
                        }
                    }) {
                        HStack(spacing: 6) {
                            Image(systemName: "location.fill")
                                .font(.system(size: 14))
                            Text("Use my current location")
                                .font(.system(size: 13, weight: .semibold))
                        }
                        .foregroundColor(Color(hex: "#2563EB"))
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .background(Color.white)
                        .cornerRadius(20)
                        .shadow(color: .black.opacity(0.15), radius: 4, y: 2)
                    }
                    .padding(.bottom, 230)
                }
            }

            // Header
            VStack {
                HStack {
                    Button(action: {
                        if isMapActive {
                            isMapActive = false
                        } else {
                            presentationMode.wrappedValue.dismiss()
                        }
                    }) {
                        Image(systemName: "arrow.left")
                            .font(.system(size: 20, weight: .medium))
                            .foregroundColor(Color(hex: "#1F2937"))
                            .padding(8)
                    }

                    Text("Add new address")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "#111827"))

                    Spacer()
                }
                .padding(.horizontal, 16)
                .padding(.top, 8)
                .background(Color.white)

                Spacer()
            }

            // Bottom Sheet
            VStack {
                Spacer()

                VStack(spacing: 0) {
                    if !isMapActive {
                        // Inactive State - 2 Buttons
                        inactiveBottomSheet
                    } else {
                        // Active State - Deliver To
                        activeBottomSheet
                    }
                }
                .padding(20)
                .padding(.bottom, 20)
                .background(Color.white)
                .cornerRadius(16, corners: [.topLeft, .topRight])
            }
        }
    }

    // MARK: - Inactive Bottom Sheet
    private var inactiveBottomSheet: some View {
        VStack(spacing: 4) {
            Text("Where do you want us to deliver the order?")
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(Color(hex: "#111827"))
                .multilineTextAlignment(.center)

            Text("This will help with the right map location")
                .font(.system(size: 13))
                .foregroundColor(Color(hex: "#6B7280"))
                .padding(.bottom, 16)

            // Away from my location button
            Button(action: {
                step = .detailsForm
            }) {
                Text("Away from my location")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 48)
                    .background(Color(hex: "#2563EB"))
                    .cornerRadius(8)
            }

            // Use current location button
            Button(action: {
                isLoading = true
                locationManager.startUpdating()
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                    isLoading = false
                    isMapActive = true
                }
            }) {
                HStack(spacing: 8) {
                    if isLoading {
                        ProgressView()
                            .progressViewStyle(
                                CircularProgressViewStyle(tint: Color(hex: "#2563EB")))
                    } else {
                        Image(systemName: "location.fill")
                            .font(.system(size: 18))
                        Text("Use current location")
                            .font(.system(size: 15, weight: .semibold))
                    }
                }
                .foregroundColor(Color(hex: "#2563EB"))
                .frame(maxWidth: .infinity)
                .frame(height: 48)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color(hex: "#2563EB"), lineWidth: 1)
                )
            }
        }
    }

    // MARK: - Active Bottom Sheet
    private var activeBottomSheet: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Deliver To")
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(Color(hex: "#111827"))

            // Address Card
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    HStack(spacing: 8) {
                        Image(systemName: "location")
                            .font(.system(size: 18))
                            .foregroundColor(Color(hex: "#374151"))
                        Text(regionName)
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(Color(hex: "#111827"))
                    }

                    Spacer()

                    Button(action: {
                        isMapActive = false
                    }) {
                        Text("Change")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(Color(hex: "#2563EB"))
                    }
                }

                Text(fullAddress.isEmpty ? "Fetching address..." : fullAddress)
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "#4B5563"))
                    .lineLimit(2)
            }
            .padding(12)
            .background(Color.white)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(Color(hex: "#E5E7EB"), lineWidth: 1)
            )
            .cornerRadius(8)

            // Add address details button
            Button(action: {
                step = .detailsForm
            }) {
                Text("Add address Details")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 48)
                    .background(Color(hex: "#2563EB"))
                    .cornerRadius(8)
            }
        }
    }

    // MARK: - Details Form View
    private var detailsFormView: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Button(action: {
                    step = .mapSelect
                }) {
                    Image(systemName: "arrow.left")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(Color(hex: "#1F2937"))
                        .padding(8)
                }

                Text("Add Delivery Address")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(Color(hex: "#111827"))

                Spacer()
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color.white)
            .overlay(
                Rectangle()
                    .fill(Color(hex: "#F3F4F6"))
                    .frame(height: 1),
                alignment: .bottom
            )

            ScrollView {
                VStack(alignment: .leading, spacing: 12) {
                    // Contact Details
                    Text("Contact Details")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(Color(hex: "#374151"))
                        .padding(.top, 8)

                    FormTextField(placeholder: "Full Name (Required)*", text: $name)
                    FormTextField(
                        placeholder: "Phone Number (Required)*", text: $phone,
                        keyboardType: .phonePad)

                    // Address Details
                    Text("Address Details")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(Color(hex: "#374151"))
                        .padding(.top, 8)

                    HStack(spacing: 12) {
                        FormTextField(
                            placeholder: "Pincode*", text: $pincode, keyboardType: .numberPad)
                        FormTextField(placeholder: "City*", text: $city)
                    }

                    FormTextField(placeholder: "State*", text: $state)
                    FormTextField(placeholder: "House No., Building Name*", text: $addressLine1)
                    FormTextField(placeholder: "Road Name, Area, Colony*", text: $addressLine2)
                    FormTextField(placeholder: "Landmark (Optional)", text: $landmark)

                    // Save Button
                    Button(action: saveAddress) {
                        Text("Save Address")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 48)
                            .background(Color(hex: "#2563EB"))
                            .cornerRadius(8)
                    }
                    .padding(.top, 24)
                }
                .padding(16)
            }
        }
        .background(Color.white)
    }

    // MARK: - Helper Methods
    private func reverseGeocode(location: CLLocation) {
        let geocoder = CLGeocoder()
        geocoder.reverseGeocodeLocation(location) { placemarks, error in
            if let placemark = placemarks?.first {
                regionName = placemark.subLocality ?? placemark.locality ?? "Unknown"

                var parts: [String] = []
                if let street = placemark.thoroughfare { parts.append(street) }
                if let subLocality = placemark.subLocality { parts.append(subLocality) }
                if let city = placemark.locality { parts.append(city) }
                if let state = placemark.administrativeArea { parts.append(state) }
                if let postalCode = placemark.postalCode { parts.append(postalCode) }

                fullAddress = parts.joined(separator: ", ")

                // Pre-fill form
                self.city = placemark.locality ?? ""
                self.state = placemark.administrativeArea ?? ""
                self.pincode = placemark.postalCode ?? ""
                self.addressLine1 = placemark.thoroughfare ?? ""
                self.addressLine2 = placemark.subLocality ?? ""
            }
        }
    }

    private func reverseGeocodeCenter() {
        let location = CLLocation(
            latitude: region.center.latitude, longitude: region.center.longitude)
        reverseGeocode(location: location)
    }

    private func saveAddress() {
        guard !name.isEmpty, !phone.isEmpty, !pincode.isEmpty, !addressLine1.isEmpty, !city.isEmpty,
            !state.isEmpty
        else {
            return
        }

        let newAddress = UserAddress(
            _id: "",  // Backend will generate ID
            userId: "",  // Backend will set user ID from auth token
            name: name,
            phone: phone,
            addressLine1: addressLine1,
            addressLine2: addressLine2,
            city: city,
            state: state,
            pincode: pincode,
            isDefault: false
        )

        // Save to backend
        Task {
            do {
                let savedAddress = try await APIService.shared.saveAddress(newAddress)
                await MainActor.run {
                    onAddressSelected?(savedAddress)
                    presentationMode.wrappedValue.dismiss()
                }
            } catch {
                print("Error saving address: \(error)")
                // Still return the local address on error
                await MainActor.run {
                    onAddressSelected?(newAddress)
                    presentationMode.wrappedValue.dismiss()
                }
            }
        }
    }
}

// MARK: - Form Text Field
struct FormTextField: View {
    let placeholder: String
    @Binding var text: String
    var keyboardType: UIKeyboardType = .default

    var body: some View {
        TextField(placeholder, text: $text)
            .keyboardType(keyboardType)
            .font(.system(size: 14))
            .padding(12)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(Color(hex: "#D1D5DB"), lineWidth: 1)
            )
    }
}

// MARK: - Triangle Shape
struct Triangle: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        path.closeSubpath()
        return path
    }
}
