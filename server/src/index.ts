import app from './app.js';

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// https://task-management-system-hazel-phi.vercel.app/