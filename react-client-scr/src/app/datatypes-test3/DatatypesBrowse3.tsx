import * as React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { observable } from "mobx";
import { Modal, Button } from "antd";

import {
  collection,
  injectMainStore,
  MainStoreInjected
} from "@cuba-platform/react-core";
import { DataTable, Spinner } from "@cuba-platform/react-ui";

import { DatatypesTestEntity } from "../../cuba/entities/scr_DatatypesTestEntity";
import { SerializedEntity } from "@cuba-platform/rest";
import { DatatypesManagement3 } from "./DatatypesManagement3";
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps
} from "react-intl";

@injectMainStore
@observer
class DatatypesBrowse3Component extends React.Component<
  MainStoreInjected & WrappedComponentProps
> {
  dataCollection = collection<DatatypesTestEntity>(DatatypesTestEntity.NAME, {
    view: "datatypesTestEntity-view",
    sort: "-updateTs"
  });
  @observable selectedRowKey: string | undefined;

  fields = [
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

  showDeletionDialog = (e: SerializedEntity<DatatypesTestEntity>) => {
    Modal.confirm({
      title: this.props.intl.formatMessage(
        { id: "management.browser.delete.areYouSure" },
        { instanceName: e._instanceName }
      ),
      okText: this.props.intl.formatMessage({
        id: "management.browser.delete.ok"
      }),
      cancelText: this.props.intl.formatMessage({ id: "common.cancel" }),
      onOk: () => {
        this.selectedRowKey = undefined;
        return this.dataCollection.delete(e);
      }
    });
  };

  render() {
    if (this.props.mainStore?.isEntityDataLoaded() !== true) return <Spinner />;

    const buttons = [
      <Link
        to={DatatypesManagement3.PATH + "/" + DatatypesManagement3.NEW_SUBPATH}
        key="create"
      >
        <Button
          htmlType="button"
          style={{ margin: "0 12px 12px 0" }}
          type="primary"
          icon="plus"
        >
          <span>
            <FormattedMessage id="common.create" />
          </span>
        </Button>
      </Link>,
      <Link
        to={DatatypesManagement3.PATH + "/" + this.selectedRowKey}
        key="edit"
      >
        <Button
          htmlType="button"
          style={{ margin: "0 12px 12px 0" }}
          disabled={!this.selectedRowKey}
          type="default"
        >
          <FormattedMessage id="common.edit" />
        </Button>
      </Link>,
      <Button
        htmlType="button"
        style={{ margin: "0 12px 12px 0" }}
        disabled={!this.selectedRowKey}
        onClick={this.deleteSelectedRow}
        key="remove"
        type="default"
      >
        <FormattedMessage id="common.remove" />
      </Button>
    ];

    return (
      <DataTable
        dataCollection={this.dataCollection}
        fields={this.fields}
        onRowSelectionChange={this.handleRowSelectionChange}
        hideSelectionColumn={true}
        buttons={buttons}
      />
    );
  }

  getRecordById(id: string): SerializedEntity<DatatypesTestEntity> {
    const record:
      | SerializedEntity<DatatypesTestEntity>
      | undefined = this.dataCollection.items.find(record => record.id === id);

    if (!record) {
      throw new Error("Cannot find entity with id " + id);
    }

    return record;
  }

  handleRowSelectionChange = (selectedRowKeys: string[]) => {
    this.selectedRowKey = selectedRowKeys[0];
  };

  deleteSelectedRow = () => {
    this.showDeletionDialog(this.getRecordById(this.selectedRowKey!));
  };
}

const DatatypesBrowse3 = injectIntl(DatatypesBrowse3Component);

export default DatatypesBrowse3;
