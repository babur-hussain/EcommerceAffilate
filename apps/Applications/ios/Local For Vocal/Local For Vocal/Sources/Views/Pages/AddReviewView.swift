import SwiftUI

struct AddReviewView: View {
    @Environment(\.presentationMode) var presentationMode
    let productId: String
    var onReviewSubmitted: () -> Void = {}

    @State private var rating: Int = 5
    @State private var comment: String = ""
    @State private var isSubmitting = false
    @State private var errorMessage: String? = nil

    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                // Rating Section
                VStack(spacing: 8) {
                    Text("Rate this product")
                        .font(.headline)
                        .foregroundColor(.gray)

                    HStack {
                        StarRatingView(rating: rating, size: 32, interactive: true) { newRating in
                            rating = newRating
                        }

                        Text("\(rating)/5")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.yellow)
                            .padding(.leading, 8)
                    }
                }
                .padding(.top, 20)

                // Comment Section
                VStack(alignment: .leading, spacing: 8) {
                    Text("Write your review")
                        .font(.headline)
                        .foregroundColor(.gray)

                    TextEditor(text: $comment)
                        .frame(height: 120)
                        .padding(8)
                        .background(Color(hex: "#F9FAFB"))
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                        )
                        .cornerRadius(8)
                }

                if let error = errorMessage {
                    Text(error)
                        .foregroundColor(.red)
                        .font(.caption)
                }

                Spacer()

                // Submit Button
                Button(action: submitReview) {
                    HStack {
                        if isSubmitting {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        } else {
                            Text("Submit Review")
                                .fontWeight(.bold)
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color(hex: "#2563EB"))
                    .foregroundColor(.white)
                    .cornerRadius(8)
                    .opacity(isSubmitting ? 0.7 : 1)
                }
                .disabled(isSubmitting || comment.isEmpty)
            }
            .padding()
            .navigationTitle("Write a Review")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        presentationMode.wrappedValue.dismiss()
                    }
                }
            }
        }
    }

    private func submitReview() {
        guard !comment.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }

        isSubmitting = true
        errorMessage = nil

        Task {
            let success = await ReviewManager.shared.submitReview(
                productId: productId,
                rating: rating,
                comment: comment
            )

            await MainActor.run {
                isSubmitting = false
                if success {
                    onReviewSubmitted()
                    presentationMode.wrappedValue.dismiss()
                } else {
                    errorMessage = "Failed to submit review. Keep it generic."
                }
            }
        }
    }
}
