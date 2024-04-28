import { Skeleton } from "@/components/ui/skeleton";
import { getFutsalCenters } from "@/queries/futsalCenterQueries";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import React from "react";

const SelectFutsalCenter = React.forwardRef<HTMLSelectElement, any>((props, ref) => {
  const supabase = createClient();
  const { data: futsalCenters, isLoading, error } = useQuery(getFutsalCenters(supabase), { enabled: !!supabase });

  if (isLoading)
    return (
      <div className="flex items-center">
        <Skeleton className="w-24 h-6" />
      </div>
    );

  return (
    <div className="flex flex-col w-full mb-4">
      <label htmlFor="futsalCenter" className="text-sm font-semibold text-gray-600">Futsal Center</label>
      <select ref={ref} {...props} className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5" required>
        <option value="">Select Futsal Center</option>
        {futsalCenters?.map((center) => (
          <option key={center.id} value={center.id}>
            {center.name}
          </option>
        ))}
      </select>
    </div>
  );
});

SelectFutsalCenter.displayName = "SelectFutsalCenter";

export default SelectFutsalCenter;
