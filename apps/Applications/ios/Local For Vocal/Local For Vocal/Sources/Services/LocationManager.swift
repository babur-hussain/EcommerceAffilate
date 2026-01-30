import Combine
import CoreLocation

public class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate {
    public static let shared = LocationManager()
    private let locationManager = CLLocationManager()
    private let geocoder = CLGeocoder()

    @Published var location: CLLocation?
    @Published var address: String = "Locating..."
    @Published var city: String = "Select Location"
    @Published var permissionStatus: CLAuthorizationStatus = .notDetermined
    @Published var errorMessage: String?

    override init() {
        super.init()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.distanceFilter = 100  // Update every 100 meters
        permissionStatus = locationManager.authorizationStatus
    }

    func requestPermission() {
        locationManager.requestWhenInUseAuthorization()
    }

    func startUpdating() {
        if permissionStatus == .authorizedWhenInUse || permissionStatus == .authorizedAlways {
            locationManager.startUpdatingLocation()
        } else {
            requestPermission()
        }
    }

    public func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        permissionStatus = manager.authorizationStatus
        if permissionStatus == .authorizedWhenInUse || permissionStatus == .authorizedAlways {
            manager.startUpdatingLocation()
        } else if permissionStatus == .denied || permissionStatus == .restricted {
            errorMessage = "Location access denied. Please enable it in Settings."
            address = "Location Denied"
            city = "Select Location"
        }
    }

    public func locationManager(
        _ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]
    ) {
        guard let newLocation = locations.last else { return }
        location = newLocation
        reverseGeocode(location: newLocation)
        manager.stopUpdatingLocation()  // Stop after getting one good fix to save battery
    }

    public func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("Location error: \(error.localizedDescription)")
        errorMessage = error.localizedDescription
        address = "Failed to locate"
    }

    private func reverseGeocode(location: CLLocation) {
        geocoder.reverseGeocodeLocation(location) { [weak self] placemarks, error in
            guard let self = self else { return }

            if error != nil {
                self.address = "Address not found"
                return
            }

            if let placemark = placemarks?.first {
                // Construct address string
                let street = placemark.thoroughfare ?? ""
                let subLocality = placemark.subLocality ?? ""
                let city = placemark.locality ?? ""
                let state = placemark.administrativeArea ?? ""
                let country = placemark.isoCountryCode ?? ""

                // Smart formatting
                if !subLocality.isEmpty {
                    self.address = "\(subLocality), \(city)"
                    self.city = subLocality.uppercased()
                } else if !street.isEmpty {
                    self.address = "\(street), \(city)"
                    self.city = city.uppercased()
                } else {
                    self.address = "\(city), \(state)"
                    self.city = city.uppercased()
                }

                if self.city.isEmpty {
                    self.city = "CURRENT LOCATION"
                }
            }
        }
    }
}
