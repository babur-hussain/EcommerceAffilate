#!/bin/bash

echo "Checking Firebase Login status..."
if ! firebase login --interactive --reauth; then
    echo "Please log in to Firebase to deploy rules."
    exit 1
fi

echo "Deploying Firestore Rules..."
firebase deploy --only firestore:rules --project affilate-ecommerce-56ccc

echo "Done! If successful, the permission error should disappear."
