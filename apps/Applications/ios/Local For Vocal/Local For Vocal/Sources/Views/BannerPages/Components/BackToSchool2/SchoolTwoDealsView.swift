import SwiftUI

struct SchoolTwoDealsView: View {
    let component: SDUIComponent

    struct DealItem: Identifiable {
        let id: String
        let title: String
        let offer: String
        let offerColor: String
        let price: String
        let borderColor: String  // Side border color
        let image: String
    }

    let deals = [
        DealItem(
            id: "1", title: "Spiral Notebook", offer: "Buy 2 Get 1 Free", offerColor: "16A34A",
            price: "$4.99", borderColor: "FACC15",
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCEa3u_1cNHpa6TAMxdKQwY8gExaLB6S6KIsgmy2X4DhoD8qoDejMdIRDHvjNNQHvhZdaB2UCh7Qq6qo522z5u8VLjVtCMZDM0ngq8fv1ykty35QqaVIrNeuJTnOkSErttb7nQII0a8P7oqmU4hQW670UuB09umtISk0Vq84ubLZAzJ5PD890x75_slf4porQ1gXKF0p4icSiBGsVGL0EVUyflRruF-SRjLFEf4aCsmXqhTvJMJ82wRzQ2BPBbt03Gqs6F0_bDrIZ-N"
        ),
        DealItem(
            id: "2", title: "Geometry Set", offer: "Clearance", offerColor: "2563EB",
            price: "$8.50", borderColor: "60A5FA",
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAhLz22N2B6CX4y1Oq-3gdaf6hHaW3ioMJgC0lQ_sNDUbsajCMapVdEdd1C-5YTCAGzTkjyt13OJTFqHcPHEtFSyLfdIQXaH0qem1t-6VLDH9fk_NFS1hBH8wNoJHCnDUT9d6EVndkx1jXhk_RfEAzyGu-wbBxQ04M_1K1IwyKONy0OJpdzVMeC8oQNAFRIERHceiTDleCECDHSZdkpf8DMznxjHl1_ygAXcwRDWeu0KnK1INDjWFYYW8mE4hwIXIXPl4MGIfsY22oN"
        ),
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Deals of the Week")
                .font(.system(size: 24, weight: .bold))
                .foregroundColor(.white)
                .padding(.horizontal, 16)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(deals) { item in
                        HStack {
                            AsyncImage(url: URL(string: item.image)) { phase in
                                if let image = phase.image {
                                    image.resizable().aspectRatio(contentMode: .fill)
                                } else {
                                    Color.gray
                                }
                            }
                            .frame(width: 64, height: 64)
                            .cornerRadius(8)
                            .padding(.trailing, 12)

                            VStack(alignment: .leading, spacing: 2) {
                                Text(item.title)
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(Color(hex: "1F2937"))

                                Text(item.offer)
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(Color(hex: item.offerColor))

                                Text(item.price)
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(Color(hex: "111827"))
                            }
                            Spacer()
                        }
                        .padding(12)
                        .frame(width: 280)
                        .background(Color.white)
                        .cornerRadius(12)
                        .overlay(
                            Rectangle()
                                .fill(Color(hex: item.borderColor))
                                .frame(width: 4)
                                .cornerRadius(2, corners: [.topLeft, .bottomLeft]),  // Requires extension or masking
                            alignment: .leading
                        )
                        .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)
                    }
                }
                .padding(.horizontal, 16)
            }
        }
        .padding(.bottom, 24)
    }
}
