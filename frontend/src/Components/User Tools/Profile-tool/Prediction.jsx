const Prediction = () => {
    return (
      <div>
        <h5 className="text-lg font-bold">Violation Prediction</h5>
        <p>
          Based on your driving history, the system predicts possible violations
          and risk level.
        </p>
        <table className="w-full mt-2 border-collapse border border-black">
          <tbody>
            <tr className="border-b border-black">
              <th className="p-2 text-left font-semibold border border-black">
                Future Risk Level
              </th>
              <td className="p-2 border border-black">
                <span className="px-3 py-1 rounded-lg bg-yellow-500 text-black">
                  Medium
                </span>
              </td>
            </tr>
            <tr className="border-b border-black">
              <th className="p-2 text-left font-semibold border border-black">
                Predicted Violations
              </th>
              <td className="p-2 border border-black">
                Speeding, Traffic Signal Violation
              </td>
            </tr>
            <tr>
              <th className="p-2 text-left font-semibold border border-black">
                Suggestions
              </th>
              <td className="p-2 border border-black">
                Reduce speed in urban areas and follow traffic signals carefully.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  export default Prediction;  