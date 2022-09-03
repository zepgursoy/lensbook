import React, { useEffect, useRef, useState } from "react";
import { apolloClient, search } from "api";
import ProfilePreview from "./ProfilePreview";

function Search() {
  const [searchResult, setSearchResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        clearInput();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const searchLensProfile = async (value: any) => {
    console.log("searching", value);
    const result = await apolloClient.query({
      query: search,
      variables: {
        request: {
          query: value,
          type: "PROFILE",
          limit: 5,
        },
      },
    });

    if (result.data && result.data.search.items.length > 0) {
      console.log("result from lens", result.data.search.items);
      setIsOpen(true);
      return result.data.search.items;
    }

    return [];
  };

  const handleSearch = async (event: any) => {
    const value = event.target.value;
    setSearchQuery(value);

    if (value.length === 0) {
      setSearchResult([]);
    } else {
      const result = await searchLensProfile(value);
      setSearchResult(result);
    }
  };

  const clearInput = () => {
    setSearchResult([]);
    setSearchQuery("");
  };

  return (
    <div className="w-96 z-10">
      <div aria-hidden="true" className="max-w-xs mr-12 relative">
        <label className="flex items-center border border-gray-100 rounded-lg px-4 py-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6 1.99979C4.93913 1.99979 3.92172 2.42122 3.17157 3.17136C2.42143 3.92151 2 4.93892 2 5.99979C2 7.06066 2.42143 8.07807 3.17157 8.82822C3.92172 9.57836 4.93913 9.99979 6 9.99979C7.06087 9.99979 8.07828 9.57836 8.82843 8.82822C9.57857 8.07807 10 7.06066 10 5.99979C10 4.93892 9.57857 3.92151 8.82843 3.17136C8.07828 2.42122 7.06087 1.99979 6 1.99979ZM1.13461e-07 5.99979C-0.00012039 5.05549 0.222642 4.1245 0.650171 3.28253C1.0777 2.44056 1.69792 1.71139 2.4604 1.15432C3.22287 0.597243 4.10606 0.228002 5.03815 0.0766228C5.97023 -0.0747564 6.92488 -0.00399905 7.82446 0.28314C8.72404 0.570279 9.54315 1.06569 10.2152 1.72909C10.8872 2.39248 11.3931 3.20512 11.6919 4.10092C11.9906 4.99672 12.0737 5.95038 11.9343 6.88434C11.795 7.8183 11.4372 8.70619 10.89 9.47579L15.707 14.2928C15.8892 14.4814 15.99 14.734 15.9877 14.9962C15.9854 15.2584 15.8802 15.5092 15.6948 15.6946C15.5094 15.88 15.2586 15.9852 14.9964 15.9875C14.7342 15.9897 14.4816 15.8889 14.293 15.7068L9.477 10.8908C8.57936 11.5291 7.52335 11.9079 6.42468 11.9859C5.326 12.0639 4.22707 11.8379 3.2483 11.3328C2.26953 10.8276 1.44869 10.0628 0.875723 9.12214C0.30276 8.18147 -0.000214051 7.10122 1.13461e-07 5.99979Z"
              fill="#212322"
            ></path>
          </svg>
          <input
            className="h-8 p-4 text-sm w-full focus:outline-none"
            placeholder="Search"
            onChange={handleSearch}
            value={searchQuery}
          />
        </label>

        {isOpen && (
          <div
            className="flex absolute flex-col mt-2 w-full sm:max-w-md "
            ref={dropdownRef}
          >
            {searchQuery.length > 0 && (
              <div className="rounded-none sm:rounded-xl border bg-white overflow-y-auto py-2 max-h-[80vh]">
                {searchResult.map((profile, index) => {
                  return (
                    <ProfilePreview
                      key={index}
                      profile={profile}
                      setIsOpen={setIsOpen}
                      clearInput={clearInput}
                      fromComponent="search"
                    />
                  );
                })}
                {searchResult.length === 0 && (
                  <div className="py-2 px-4">No matching profiles</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
