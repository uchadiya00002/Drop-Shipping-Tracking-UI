import React, { useEffect, useState } from "react";
import {
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import "date-fns";
import { AiOutlineSearch } from "react-icons/ai";
import { Close } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useAuth } from "../utils/hooks";
import Pagination from "../components/UI/Pagination";
import { useRouter } from "next/router";
import { $windowExists, listFromDict } from "../utils";
import ViewDetails from "../components/UI/ViewDetails";
import styled from "@emotion/styled";
import {
  fetchTransactionalData,
  updateTransactionalData,
} from "../store/slices/infoRecordSlice";
import TransactionSelDate from "../components/UI/TransactionSelDate";
import TransactionTable from "../components/Tables/TransactionTable";
import SearchBar from "../components/UI/SearchBar";
import CustomSelect from "../components/UI/CustomSelect";

const allStatus = [
  {
    value: "ORDERED",
    label: "ORDERED",
  },
  {
    value: "CONFIRMED",
    label: "CONFIRMED",
  },
  {
    value: "PARTIALY CONFIRMED",
    label: "PARTIALLY CONFIRMED",
  },

  {
    value: "PARTIALLY REJECTED",
    label: "PARTIALLY REJECTED",
  },
  {
    value: "RECEIVING",
    label: "RECEIVING",
  },
  {
    value: "SHIPPED",
    label: "SHIPPED",
  },
  {
    value: "REJECTED",
    label: "REJECTED",
  },
];

const TransactionalData = (props) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState(0);
  const [loading, setLoading] = useState(false);
  const [transactionalDataResult, setTransactionalDataResult] = useState([]);
  const [count, setCount] = useState(0);
  const route = useRouter();
  const { user, fallBack } = useAuth();
  const [selectedItem, setSelectedItem] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [editInfo, setEditInfo] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [statusOfNewDate, setStatusOfNewDate] = useState("");
  const [specType, setSpecType] = useState(route?.query?.type);
  const [reasonType, setReasonType] = useState(route?.query?.reason);
  const [newDate, setNewDate] = useState(new Date());
  const [sortKeys, setSortKeys] = useState({
    poNumber: 1,
    orderDate: 1,
    deliveryDate: 1,
    newDeliveryDate: 1,
    groupCode: 1,
    companyCode: 1,
    plantName: 1,
  });
  const [selectedColumnKey, setSelectedColumnKey] = useState("");
  const [sort, setSort] = useState(1);
  const [selectedHeading, setSelectedHeading] = useState("");

  useEffect(async () => {
    if (user) {
      if (route.query.type) {
        const data = route?.query?.type;
        setSpecType(data);
      }
      if (route.query.reason) {
        const res = route?.query?.reason;
        setReasonType(res);
      }
      getTransactionalData();
    }
  }, [
    user,
    page,
    searchText,
    limit,
    status,
    specType,
    reasonType,
    route,
    sortKeys,
  ]);

  const handleSort = async (columnKey) => {
    setSelectedColumnKey(columnKey);
    handleSortValue();
  };

  const handleSortValue = () => {
    let _sortKeys = { ...sortKeys };

    Object.keys(_sortKeys)?.map((key) => {
      if (selectedColumnKey !== key) {
        _sortKeys[key] = 1;
      }
    });

    switch (sortKeys[selectedColumnKey]) {
      case 1:
        _sortKeys[selectedColumnKey] = -1;
        break;
      case -1:
        _sortKeys[selectedColumnKey] = 0;
        break;
      case 0:
        _sortKeys[selectedColumnKey] = 1;
    }

    setSortKeys(_sortKeys);
  };

  const getTransactionalData = async () => {
    if (selectedColumnKey != "") {
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      let sort;
      if (selectedColumnKey != "" && sortKeys[selectedColumnKey] != 0) {
        sort = {
          [selectedColumnKey]: sortKeys[selectedColumnKey],
        };
      }

      let payload;
      if (route?.query?.type) {
        payload = {
          pagination: {
            limit: limit,
            page: page,
          },
          conditions: {
            statusForNewDeliveryDate: specType,
          },
          sort: sort,
        };
      } else if (route?.query?.reason) {
        payload = {
          pagination: {
            limit: limit,
            page: page,
          },
          conditions: {
            reason: reasonType,
          },
          sort: sort,
        };
      } else {
        payload = {
          pagination: {
            limit: limit,
            page: page,
          },
          sort: sort,
        };
      }

      if (searchText.length > 0) {
        payload.searchTerm = searchText;
      }

      if (status != "ALL") {
        payload.conditions = {
          status: status,
        };
      }
      const res = await dispatch(fetchTransactionalData(payload));
      if (res) {
        setTransactionalDataResult(res.data);
        setCount(res.count);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const updateTransactions = async (values) => {
    const { _id, newDeliveryDate, reason, statusForNewDeliveryDate } = values;

    let conditions = {};

    if (_id) {
      conditions._id = _id;
    }
    if (newDeliveryDate) {
      conditions.newDeliveryDate = newDeliveryDate;
    }
    if (reason) {
      conditions.reason = reason;
    }

    if (statusForNewDeliveryDate) {
      conditions.statusForNewDeliveryDate = statusForNewDeliveryDate;
    }

    let payload = conditions;
    try {
      const res = await dispatch(updateTransactionalData(payload));
      if (res) {
        getTransactionalData();
        setEditInfo(false);
        setNewDate("");
        setSelectedReason("");
      }
    } catch (error) {}
  };

  const listFields = listFromDict({
    poNumber: { name: "Order ID" },
    orderDate: { name: "Order Date" },
    description: { name: "Description" },
    deliveryDate: { name: "Delivery Date" },
    newDeliveryDate: { name: "New Delivery Date" },
    statusForNewDeliveryDate: { name: "Status of New Delivery Date" },
    reason: { name: "Reason" },
    status: { name: "Status" },
  });

  if (!$windowExists) {
    return fallBack;
  } else if (!user) {
    // router.push('/')
    return fallBack;
  }

  return (
    <div className="w-full bg-[#E5E5E5] flex flex-col xs:min-h-screen grow px-5 xs:w-full">
      <div className="flex py-5 bg-[#E5E5E5] w-full  z-[3] xs:w-full drawer-open reduce-wid  drawer-close smooth   fixed">
        <h1 className="text-2xl font-bold lg:text-xl ">Transactional Data</h1>
      </div>
      <div className="flex justify-end xs:pb-10 xs:justify-center items-center px-2.5   bg-[white] z-[3] drawer-open reduce-wid mt-16 drawer-close smooth   fixed">
        <div className="flex flex-row xs:flex-col my-4  xs:justify-center xs:w-full justify-end items-center  ">
          <div className="xs:w-full xs:mb-2 ml-2 mr-1">
            <CustomSelect
              value={status}
              values={allStatus}
              onChange={(e) => setStatus(e.target.value)}
              className="md:w-52 lg:w-52 xl:w-32 2xl:w-32 w-full"
            />
          </div>
          <div className="ml-1 xs:w-full xs:mx-3">
            <SearchBar
              searchText={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              clear={() => setSearchText("")}
            />
          </div>
          <div className="ml-1 xs:my-3 flex justify-center items-center text-[#65748B]">
            <Pagination
              limit={limit}
              page={page}
              count={count}
              length={transactionalDataResult.length}
              onClick={(val) => setPage(val)}
            />
          </div>
          <div className="ml-1 xs:mx-3 xs:w-full ">
            <CustomSelect
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="md:w-28 lg:w-28 xl:w-32 2xl:w-32 w-full"
              limit={true}
            />
          </div>
        </div>
      </div>
      <div>
        {!loading && transactionalDataResult?.length > 0 ? (
          <div class="overflow-hidden mt-32 xs:mt-72 fixed z-[3]  drawer-open reduce-wid drawer-close smooth  bg-[white]  ">
            <TransactionTable
              transactionalDataResult={transactionalDataResult}
              loading={loading}
              user={user}
              sortBy={sortBy}
              setSortBy={setSortBy}
              selectedId={selectedId}
              setEditInfo={setEditInfo}
              setSelectedId={setSelectedId}
              setStatusOfNewDate={setStatusOfNewDate}
              setSelectedReason={setSelectedReason}
              setNewDate={setNewDate}
              getTransactionalData={getTransactionalData}
              setOpenPopup={setOpenPopup}
              handleSort={handleSort}
              handleSortValue={handleSortValue}
              setSelectedItem={setSelectedItem}
              selectedColumnKey={selectedColumnKey}
              sortKeys={sortKeys}
              sort={sort}
              setSort={setSort}
              selectedHeading={selectedHeading}
              setSelectedHeading={setSelectedHeading}
            />

            {!transactionalDataResult?.length > 0 && (
              <div className="flex justify-center items-center w-full font-semibold text-lg my-32 ">
                No Records...
              </div>
            )}
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center">
            <div className="my-60">
              <CircularProgress />
            </div>
          </div>
        ) : (
          <div
            className="flex justify-center items-center bg-[white]"
            style={{
              marginTop: "80px",
            }}
          >
            <div className="my-28 ">No Records...</div>
          </div>
        )}
      </div>

      <TransactionSelDate
        editInfo={editInfo}
        user={user}
        newDate={newDate}
        selectedReason={selectedReason}
        setNewDate={setNewDate}
        setSelectedReason={setSelectedReason}
        updateTransactions={updateTransactions}
        setEditInfo={setEditInfo}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        selectedItem={selectedItem}
        statusOfNewDate={statusOfNewDate}
      />

      <ViewDetails
        open={openPopup}
        onClose={() => {
          setOpenPopup(false);
          setSelectedItem(null);
        }}
        focused={selectedItem}
        listFields={listFields}
      />
    </div>
  );
};

export default TransactionalData;
