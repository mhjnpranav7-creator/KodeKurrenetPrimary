# Limitations and attribution

- Pose landmarks and squat thresholds are heuristic; they are not clinical measurements.
- Side or three-quarter camera views, stable framing, good lighting, and a fully visible body improve results.
- The analyzer is designed for one person and one exercise in the MVP.
- The AI summary is grounded in structured measurements and has a deterministic fallback.
- Do not use this prototype to diagnose pain, injury, disease, or treatment needs.

Attribution: Google MediaPipe Pose Landmarker (`@mediapipe/tasks-vision`) is used for browser pose estimation. Supabase is an optional persistence layer. The attached Hack Day brief is the source of the HiperMove requirements.
