import React, { useCallback } from "react";
import { useLocalStore, useObserver } from "mobx-react";
import { Link } from "react-router-dom";
import { Modal, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useCollection, useMainStore } from "@cuba-platform/react-core";
import { DataTable, Spinner } from "@cuba-platform/react-ui";
import { DatatypesTestEntity } from "../../cuba/entities/scr_DatatypesTestEntity";
import { SerializedEntity } from "@cuba-platform/rest";
import { PATH, NEW_SUBPATH } from "./HooksEMTableMgt";
import { FormattedMessage, useIntl } from "react-intl";

type HooksEMTableBrowseLocalStore = {
  selectedRowKey?: string;
};

const FIELDS = [
  "bigDecimalAttr",
  "booleanAttr",
  "dateAttr",
  "dateTimeAttr",
  "doubleAttr",
  "integerAttr",
  "longAttr",
  "stringAttr",
  "timeAttr",
  "uuidAttr",
  "localDateTimeAttr",
  "offsetDateTimeAttr",
  "localDateAttr",
  "localTimeAttr",
  "offsetTimeAttr",
  "enumAttr",
  "name",
  "associationO2Oattr",
  "associationM2Oattr",
  "compositionO2Oattr",
  "intIdentityIdTestEntityAssociationO2OAttr",
  "stringIdTestEntityAssociationO2O",
  "stringIdTestEntityAssociationM2O",
  "readOnlyStringAttr"
];

const HooksEMTableBrowse = () => {
  const intl = useIntl();
  const mainStore = useMainStore();

  const dataCollection = useCollection<DatatypesTestEntity>(
    DatatypesTestEntity.NAME,
    {
      view: "datatypesTestEntity-view",
      sort: "-updateTs"
    }
  );

  const store: HooksEMTableBrowseLocalStore = useLocalStore(() => ({
    selectedRowKey: undefined
  }));

  const showDeletionDialog = useCallback(
    (e: SerializedEntity<DatatypesTestEntity>) => {
      Modal.confirm({
        title: intl.formatMessage(
          { id: "management.browser.delete.areYouSure" },
          { instanceName: e._instanceName }
        ),
        okText: intl.formatMessage({ id: "management.browser.delete.ok" }),
        cancelText: intl.formatMessage({ id: "common.cancel" }),
        onOk: () => {
          store.selectedRowKey = undefined;
          return dataCollection.current.delete(e);
        }
      });
    },
    [dataCollection, intl, store.selectedRowKey]
  );

  const getRecordById = useCallback(
    (id: string): SerializedEntity<DatatypesTestEntity> => {
      const record:
        | SerializedEntity<DatatypesTestEntity>
        | undefined = dataCollection.current.items.find(
        record => record.id === id
      );

      if (!record) {
        throw new Error("Cannot find entity with id " + id);
      }

      return record;
    },
    [dataCollection]
  );

  const deleteSelectedRow = useCallback(() => {
    if (store.selectedRowKey != null) {
      showDeletionDialog(getRecordById(store.selectedRowKey));
    }
  }, [getRecordById, showDeletionDialog, store.selectedRowKey]);

  const handleRowSelectionChange = useCallback(
    (selectedRowKeys: string[]) => {
      store.selectedRowKey = selectedRowKeys[0];
    },
    [store.selectedRowKey]
  );

  return useObserver(() => {
    if (!mainStore.isEntityDataLoaded()) {
      return <Spinner />;
    }

    const buttons = [
      <Link to={PATH + "/" + NEW_SUBPATH} key="create">
        <Button
          htmlType="button"
          style={{ margin: "0 12px 12px 0" }}
          type="primary"
          icon={<PlusOutlined />}
        >
          <span>
            <FormattedMessage id="common.create" />
          </span>
        </Button>
      </Link>,
      <Link to={PATH + "/" + store.selectedRowKey} key="edit">
        <Button
          htmlType="button"
          style={{ margin: "0 12px 12px 0" }}
          disabled={store.selectedRowKey == null}
          type="default"
        >
          <FormattedMessage id="common.edit" />
        </Button>
      </Link>,
      <Button
        htmlType="button"
        style={{ margin: "0 12px 12px 0" }}
        disabled={store.selectedRowKey == null}
        onClick={deleteSelectedRow}
        key="remove"
        type="default"
      >
        <FormattedMessage id="common.remove" />
      </Button>
    ];

    return (
      <DataTable
        dataCollection={dataCollection.current}
        fields={FIELDS}
        onRowSelectionChange={handleRowSelectionChange}
        hideSelectionColumn={true}
        buttons={buttons}
      />
    );
  });
};

export default HooksEMTableBrowse;
