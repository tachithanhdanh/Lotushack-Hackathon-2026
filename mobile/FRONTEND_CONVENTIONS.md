# Frontend Conventions (Mobile)

Scope: Expo + React Native (light mode, tiếng Việt)

- Structure
  - `src/screens/*`: Mỗi màn hình = 1 file TSX. Tên PascalCase, export default component.
  - `src/components/*`: Component tái sử dụng, props rõ ràng (không any), tách style.
  - `App.tsx`: Khai báo navigator + header, không chứa logic nghiệp vụ màn hình.
- Navigation
  - Sử dụng `@react-navigation/native-stack`.
  - Định nghĩa `RootStackParamList` trong `App.tsx` và cập nhật khi thêm route.
- Theming & i18n
  - Chỉ dùng light mode (MD3LightTheme).
  - Toàn bộ text hiển thị là tiếng Việt, không trộn Anh–Việt.
- Code style
  - Component chức năng ngắn gọn; state tối thiểu `useState/useEffect`.
  - Không để logic phức tạp trong JSX; trích xuất helper nếu cần.
  - Đặt `styles = StyleSheet.create({ ... })` cuối file; màu theo MD3 hoặc mã hex trung tính.
- Use cases trên mobile
  - UC01: `LiveGreenRingScreen` — link nổi bật ở Home.
  - UC02: `Co2MeterScreen` — mở từ Home hoặc sau khi chọn tuyến UC04.
  - UC04: `RouteSuggestionScreen` — nhập A/B, hiển thị 2–3 tuyến, chuyển sang UC02.
- Testing nhanh
  - “Chạy nhanh”: `npm run start` và mở Android/iOS bằng Expo Go.
- TODO mở rộng
  - Thêm widget vòng tròn (react-native-svg), danh sách “Điểm dịch vụ gần đây”, persist state bằng AsyncStorage.
