import * as React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { IReactionDisposer, reaction } from "mobx";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Modal, Button, Card, message } from "antd";

import {
  collection,
  injectMainStore,
  MainStoreInjected
} from "@cuba-platform/react-core";
import {
  EntityProperty,
  Paging,
  setPagination,
  Spinner
} from "@cuba-platform/react-ui";

import { StringIdTestEntity } from "../../cuba/entities/scr_StringIdTestEntity";
import { SerializedEntity } from "@cuba-platform/rest";
import { StringIdMgtCardsManagement } from "./StringIdMgtCardsManagement";
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps
} from "react-intl";
import { PaginationConfig } from "antd/es/pagination";

type Props = MainStoreInjected &
  WrappedComponentProps & {
    paginationConfig: PaginationConfig;
    onPagingChange: (current: number, pageSize: number) => void;
  };
@injectMainStore
@observer
class StringIdMgtCardsBrowseComponent extends React.Component<Props> {
  dataCollection = collection<StringIdTestEntity>(StringIdTestEntity.NAME, {
    view: "_local",
    sort: "-updateTs",
    loadImmediately: false,

    stringIdName: "identifier"
  });

  reactionDisposers: IReactionDisposer[] = [];
  fields = ["description", "productCode", "identifier"];

  componentDidMount(): void {
    this.reactionDisposers.push(
      reaction(
        () => this.props.paginationConfig,
        paginationConfig =>
          setPagination(paginationConfig, this.dataCollection, true)
      )
    );
    setPagination(this.props.paginationConfig, this.dataCollection, true);

    this.reactionDisposers.push(
      reaction(
        () => this.dataCollection.status,
        status => {
          const { intl } = this.props;
          if (status === "ERROR") {
            message.error(intl.formatMessage({ id: "common.requestFailed" }));
          }
        }
      )
    );
  }

  componentWillUnmount() {
    this.reactionDisposers.forEach(dispose => dispose());
  }

  showDeletionDialog = (e: SerializedEntity<StringIdTestEntity>) => {
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
        return this.dataCollection.delete(e);
      }
    });
  };

  render() {
    const { status, items, count } = this.dataCollection;
    const { paginationConfig, onPagingChange, mainStore } = this.props;

    if (status === "LOADING" || mainStore?.isEntityDataLoaded() !== true) {
      return <Spinner />;
    }

    return (
      <div className="narrow-layout">
        <div style={{ marginBottom: "12px" }}>
          <Link
            to={
              StringIdMgtCardsManagement.PATH +
              "/" +
              StringIdMgtCardsManagement.NEW_SUBPATH
            }
          >
            <Button htmlType="button" type="primary" icon={<PlusOutlined />}>
              <span>
                <FormattedMessage id="common.create" />
              </span>
            </Button>
          </Link>
        </div>

        {items == null || items.length === 0 ? (
          <p>
            <FormattedMessage id="management.browser.noItems" />
          </p>
        ) : null}
        {items.map(e => (
          <Card
            title={e._instanceName}
            key={e.id ? e.id : undefined}
            style={{ marginBottom: "12px" }}
            actions={[
              <DeleteOutlined
                key="delete"
                onClick={() => this.showDeletionDialog(e)}
              />,
              <Link
                to={StringIdMgtCardsManagement.PATH + "/" + e.id}
                key="edit"
              >
                <EditOutlined />
              </Link>
            ]}
          >
            {this.fields.map(p => (
              <EntityProperty
                entityName={StringIdTestEntity.NAME}
                propertyName={p}
                value={e[p]}
                key={p}
              />
            ))}
          </Card>
        ))}

        {!this.props.paginationConfig.disabled && (
          <div style={{ margin: "12px 0 12px 0", float: "right" }}>
            <Paging
              paginationConfig={paginationConfig}
              onPagingChange={onPagingChange}
              total={count}
            />
          </div>
        )}
      </div>
    );
  }
}

const StringIdMgtCardsBrowse = injectIntl(StringIdMgtCardsBrowseComponent);

export default StringIdMgtCardsBrowse;
