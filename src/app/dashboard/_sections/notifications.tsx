export default function Notifications() {
  return (
    <section className="absolute inset-0" id="notifications">
        <div className="flex items-center justify-center h-full">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold">Notifications</h2>
                <p className="text-gray-500">You have no notifications.</p>
            </div>
        </div>
    </section>
  );
}
