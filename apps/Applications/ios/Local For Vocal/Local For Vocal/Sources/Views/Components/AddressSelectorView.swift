import SwiftUI

#if canImport(UIKit)
    import UIKit
#endif

// MARK: - RoundedCorner Shape for specific corners

public struct UserAddressBarView: View {
    public let currentUserAddress: UserAddress?
    public let onTap: () -> Void

    public init(currentUserAddress: UserAddress?, onTap: @escaping () -> Void) {
        self.currentUserAddress = currentUserAddress
        self.onTap = onTap
    }

    public var body: some View {
        Button(action: onTap) {
            HStack(spacing: 12) {
                // Location Icon
                Image(systemName: "mappin.and.ellipse")
                    .font(.system(size: 18))
                    .foregroundColor(Color(hex: "#2563EB"))  // Blue

                VStack(alignment: .leading, spacing: 2) {
                    if let address = currentUserAddress {
                        HStack {
                            Text("Deliver to \(address.name) - \(address.pincode)")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(Color(hex: "#111827"))
                                .lineLimit(1)

                            if address.isDefault {
                                Text("HOME")  // Or generic badge
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(Color(hex: "#4B5563"))
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background(Color(hex: "#F3F4F6"))
                                    .cornerRadius(4)
                            }
                        }

                        Text("\(address.addressLine1), \(address.city)")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "#6B7280"))
                            .lineLimit(1)
                    } else {
                        Text("Select delivery address")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(Color(hex: "#111827"))
                        Text("Login to see your saved addresses")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "#6B7280"))
                    }
                }

                Spacer()

                // Dropdown arrow
                Image(systemName: "chevron.down")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "#9CA3AF"))
            }
            .padding(16)
            .background(Color.white)
        }
    }
}

// MARK: - UserAddress Selector Modal
public struct UserAddressSelectorView: View {
    @Binding var isVisible: Bool
    let savedUserAddresses: [UserAddress]
    @Binding var selectedUserAddressId: String?
    let onSelectUserAddress: (UserAddress) -> Void
    let onUseCurrentLocation: () -> Void
    let onAddNewUserAddress: () -> Void
    let title: String

    public init(
        isVisible: Binding<Bool>,
        savedUserAddresses: [UserAddress],
        selectedUserAddressId: Binding<String?>,
        onSelectUserAddress: @escaping (UserAddress) -> Void,
        onUseCurrentLocation: @escaping () -> Void,
        onAddNewUserAddress: @escaping () -> Void,
        title: String = "Select delivery address"
    ) {
        self._isVisible = isVisible
        self.savedUserAddresses = savedUserAddresses
        self._selectedUserAddressId = selectedUserAddressId
        self.onSelectUserAddress = onSelectUserAddress
        self.onUseCurrentLocation = onUseCurrentLocation
        self.onAddNewUserAddress = onAddNewUserAddress
        self.title = title
    }

    @State private var searchText = ""

    public var body: some View {
        ZStack(alignment: .bottom) {
            if isVisible {
                // Dimmed background
                Color.black.opacity(0.5)
                    .edgesIgnoringSafeArea(.all)
                    .onTapGesture {
                        withAnimation { isVisible = false }
                    }

                // Modal Content
                VStack(spacing: 0) {
                    // Handle
                    Capsule()
                        .fill(Color(hex: "#E5E7EB"))
                        .frame(width: 40, height: 4)
                        .padding(.top, 12)
                        .padding(.bottom, 16)

                    // Header
                    HStack {
                        Text(title)
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(Color(hex: "#111827"))
                        Spacer()
                        Button(action: { withAnimation { isVisible = false } }) {
                            Image(systemName: "xmark")
                                .font(.system(size: 20))
                                .foregroundColor(Color(hex: "#1F2937"))
                                .padding(4)
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 16)

                    // Search Bar
                    HStack(spacing: 8) {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(Color(hex: "#9CA3AF"))
                        TextField("Search by area, street name, pin code", text: $searchText)
                            .font(.system(size: 14))
                    }
                    .padding(12)
                    .background(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(Color(hex: "#E5E7EB"), lineWidth: 1)
                    )
                    .padding(.horizontal, 16)
                    .padding(.bottom, 16)

                    // Current Location
                    Button(action: {
                        onUseCurrentLocation()
                        withAnimation { isVisible = false }
                    }) {
                        HStack(spacing: 12) {
                            Image(systemName: "location.fill")
                                .font(.system(size: 20))
                                .foregroundColor(Color(hex: "#2563EB"))
                            Text("Use my current location")
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundColor(Color(hex: "#2563EB"))
                            Spacer()
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                    }

                    Divider()
                        .padding(.bottom, 16)

                    // Saved UserAddresses Header
                    HStack {
                        Text("Saved addresses")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(Color(hex: "#374151"))
                        Spacer()
                        Button(action: onAddNewUserAddress) {
                            Text("+ Add New")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(Color(hex: "#2563EB"))
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 12)

                    // UserAddress List
                    ScrollView {
                        VStack(spacing: 0) {
                            if savedUserAddresses.isEmpty {
                                Text("No saved addresses found.")
                                    .foregroundColor(Color(hex: "#9CA3AF"))
                                    .padding(32)
                            } else {
                                ForEach(savedUserAddresses) { address in
                                    UserAddressRow(
                                        address: address,
                                        isSelected: selectedUserAddressId == address.id,
                                        onSelect: {
                                            onSelectUserAddress(address)
                                            withAnimation { isVisible = false }
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
                .background(Color.white)
                #if canImport(UIKit)
                    .cornerRadius(16, corners: [.topLeft, .topRight])
                    .frame(maxHeight: UIScreen.main.bounds.height * 0.8)
                #else
                    .cornerRadius(16)
                    .frame(maxHeight: 600)  // Fallback height
                #endif
                .transition(.move(edge: .bottom))
            }
        }
        .zIndex(100)  // Ensure it sits on top
    }
}

struct UserAddressRow: View {
    let address: UserAddress
    let isSelected: Bool
    let onSelect: () -> Void

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            // Radio Button
            Image(systemName: isSelected ? "largecircle.fill.circle" : "circle")
                .font(.system(size: 20))
                .foregroundColor(isSelected ? Color(hex: "#2563EB") : Color(hex: "#D1D5DB"))
                .padding(.top, 2)

            // Address Details
            VStack(alignment: .leading, spacing: 4) {
                // Name & Tag
                HStack {
                    Text(address.name)
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(hex: "#111827"))

                    if address.isDefault {
                        Text("DEFAULT")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(Color(hex: "#2563EB"))
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color(hex: "#EFF6FF"))
                            .cornerRadius(4)
                    }
                }

                // Address Lines
                Group {
                    Text(address.addressLine1)
                    if let line2 = address.addressLine2, !line2.isEmpty {
                        Text(line2)
                    }
                    Text("\(address.city), \(address.state) - \(address.pincode)")
                    Text(address.country)
                }
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "#4B5563"))
                .fixedSize(horizontal: false, vertical: true)

                // Phone
                Text("Phone: \(address.phone)")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(Color(hex: "#6B7280"))
                    .padding(.top, 4)
            }

            Spacer()

            // Edit Button (Placeholder)
            Button(action: {
                // Action for edit
            }) {
                Image(systemName: "ellipsis")
                    .font(.system(size: 18))
                    .foregroundColor(Color(hex: "#9CA3AF"))
                    .padding(8)
            }
        }
        .padding(16)
        .background(isSelected ? Color(hex: "#F9FAFB") : Color.white)
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundColor(Color(hex: "#F3F4F6")),
            alignment: .bottom
        )
        .contentShape(Rectangle())  // Make entire row tappable
        .onTapGesture {
            onSelect()
        }
    }
}
