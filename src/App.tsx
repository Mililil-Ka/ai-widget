import { ChatWidget } from './components/ChatWidget';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Демо-страница AI-виджета
      </h1>
      <p className="text-gray-600">
        Виджет в правом нижнем углу. Попробуйте разные темы.
      </p>

      <ChatWidget />
    </div>
  );
}

export default App;