import SwiftUI

struct LanguageView: View {
    @Environment(\.presentationMode) var presentationMode

    @State private var selectedLanguage = "en"

    // Brand Colors
    private let primaryBlue = Color(red: 37 / 255, green: 99 / 255, blue: 235 / 255)

    let languages = [
        Language(code: "en", name: "English", nativeName: "English", subtext: "Default"),
        Language(code: "hi", name: "Hindi", nativeName: "हिंदी", subtext: "हिंदी में देखें"),
    ]

    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Button(action: {
                    presentationMode.wrappedValue.dismiss()
                }) {
                    Image(systemName: "arrow.left")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(Color(hex: "#111827"))
                }

                Spacer()

                Text("Select Language")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "#111827"))

                Spacer()

                Color.clear.frame(width: 20, height: 20)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            .background(Color.white)
            .overlay(
                Rectangle()
                    .fill(Color(hex: "#E5E7EB"))
                    .frame(height: 1),
                alignment: .bottom
            )

            ScrollView {
                VStack(spacing: 16) {
                    Text("Choose your preferred language")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "#111827"))
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.top, 24)

                    Text("You can change this anytime from settings")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "#6B7280"))
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.bottom, 16)

                    ForEach(languages, id: \.code) { lang in
                        LanguageCard(language: lang, isSelected: selectedLanguage == lang.code) {
                            selectedLanguage = lang.code
                        }
                    }
                }
                .padding(16)
            }

            // Footer
            VStack {
                Button(action: {
                    // Save logic would go here
                    presentationMode.wrappedValue.dismiss()
                }) {
                    Text("Continue")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(primaryBlue)
                        .cornerRadius(30)
                }
            }
            .padding(20)
            .background(Color.white)
            .overlay(
                Rectangle()
                    .fill(Color(hex: "#E5E7EB"))
                    .frame(height: 1),
                alignment: .top
            )
        }
        .background(Color.white)
        .navigationBarHidden(true)
    }
}

struct Language {
    let code: String
    let name: String
    let nativeName: String
    let subtext: String
}

struct LanguageCard: View {
    let language: Language
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(language.nativeName)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(isSelected ? Color(hex: "#1E40AF") : Color(hex: "#111827"))

                    Text(language.name)
                        .font(.system(size: 14))
                        .foregroundColor(isSelected ? Color(hex: "#3B82F6") : Color(hex: "#4B5563"))

                    Text(language.subtext)
                        .font(.system(size: 12, weight: .light))
                        .foregroundColor(isSelected ? Color(hex: "#3B82F6") : Color(hex: "#6B7280"))
                        .italic()
                }

                Spacer()

                ZStack {
                    Circle()
                        .stroke(
                            isSelected ? Color(hex: "#2563EB") : Color(hex: "#D1D5DB"), lineWidth: 2
                        )
                        .frame(width: 24, height: 24)

                    if isSelected {
                        Circle()
                            .fill(Color(hex: "#2563EB"))
                            .frame(width: 12, height: 12)
                    }
                }
            }
            .padding(20)
            .background(isSelected ? Color(hex: "#EFF6FF") : Color(hex: "#F9FAFB"))
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(isSelected ? Color(hex: "#2563EB") : Color.clear, lineWidth: 2)
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}
