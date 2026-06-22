import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { ChapterPage } from "./pages/ChapterPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chapter/:slug" element={<ChapterPage />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
