import * as React from "react";
import { FormEvent } from "react";
import { Alert, Button, Card, Form, message } from "antd";
import { observer } from "mobx-react";
import { DatatypesManagement1 } from "./DatatypesManagement1";
import { FormComponentProps } from "antd/lib/form";
import { Link, Redirect } from "react-router-dom";
import { IReactionDisposer, observable, reaction, toJS } from "mobx";
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps
} from "react-intl";

import {
  loadAssociationOptions,
  DataCollectionStore,
  instance,
  MainStoreInjected,
  injectMainStore
} from "@cuba-platform/react-core";

import {
  Field,
  withLocalizedForm,
  extractServerValidationErrors,
  constructFieldsWithErrors,
  clearFieldErrors,
  MultilineText,
  Spinner
} from "@cuba-platform/react-ui";

import "../../app/App.css";

import { DatatypesTestEntity } from "../../cuba/entities/scr_DatatypesTestEntity";
import { AssociationO2OTestEntity } from "../../cuba/entities/scr_AssociationO2OTestEntity";
import { AssociationM2OTestEntity } from "../../cuba/entities/scr_AssociationM2OTestEntity";
import { AssociationM2MTestEntity } from "../../cuba/entities/scr_AssociationM2MTestEntity";
import { IntIdentityIdTestEntity } from "../../cuba/entities/scr_IntIdentityIdTestEntity";
import { IntegerIdTestEntity } from "../../cuba/entities/scr_IntegerIdTestEntity";
import { StringIdTestEntity } from "../../cuba/entities/scr_StringIdTestEntity";

type Props = FormComponentProps & EditorProps & MainStoreInjected;

type EditorProps = {
  entityId: string;
};

@injectMainStore
@observer
class DatatypesEdit1Component extends React.Component<
  Props & WrappedComponentProps
> {
  dataInstance = instance<DatatypesTestEntity>(DatatypesTestEntity.NAME, {
    view: "datatypesTestEntity-view",
    loadImmediately: false
  });

  @observable associationO2OattrsDc:
    | DataCollectionStore<AssociationO2OTestEntity>
    | undefined;

  @observable associationM2OattrsDc:
    | DataCollectionStore<AssociationM2OTestEntity>
    | undefined;

  @observable associationM2MattrsDc:
    | DataCollectionStore<AssociationM2MTestEntity>
    | undefined;

  @observable intIdentityIdTestEntityAssociationO2OAttrsDc:
    | DataCollectionStore<IntIdentityIdTestEntity>
    | undefined;

  @observable integerIdTestEntityAssociationM2MAttrsDc:
    | DataCollectionStore<IntegerIdTestEntity>
    | undefined;

  @observable stringIdTestEntityAssociationO2OsDc:
    | DataCollectionStore<StringIdTestEntity>
    | undefined;

  @observable stringIdTestEntityAssociationM2OsDc:
    | DataCollectionStore<StringIdTestEntity>
    | undefined;

  @observable updated = false;
  @observable formRef: React.RefObject<Form> = React.createRef();
  reactionDisposers: IReactionDisposer[] = [];

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
    "associationM2Mattr",
    "compositionO2Oattr",
    "compositionO2Mattr",
    "intIdentityIdTestEntityAssociationO2OAttr",
    "integerIdTestEntityAssociationM2MAttr",
    "stringIdTestEntityAssociationO2O",
    "stringIdTestEntityAssociationM2O",
    "readOnlyStringAttr"
  ];

  @observable globalErrors: string[] = [];

  /**
   * This method should be called after the user permissions has been loaded
   */
  loadAssociationOptions = () => {
    // MainStore should exist at this point
    if (this.props.mainStore != null) {
      const { getAttributePermission } = this.props.mainStore.security;

      this.associationO2OattrsDc = loadAssociationOptions(
        DatatypesTestEntity.NAME,
        "associationO2Oattr",
        AssociationO2OTestEntity.NAME,
        getAttributePermission,
        { view: "_minimal" }
      );

      this.associationM2OattrsDc = loadAssociationOptions(
        DatatypesTestEntity.NAME,
        "associationM2Oattr",
        AssociationM2OTestEntity.NAME,
        getAttributePermission,
        { view: "_minimal" }
      );

      this.associationM2MattrsDc = loadAssociationOptions(
        DatatypesTestEntity.NAME,
        "associationM2Mattr",
        AssociationM2MTestEntity.NAME,
        getAttributePermission,
        { view: "_minimal" }
      );

      this.intIdentityIdTestEntityAssociationO2OAttrsDc = loadAssociationOptions(
        DatatypesTestEntity.NAME,
        "intIdentityIdTestEntityAssociationO2OAttr",
        IntIdentityIdTestEntity.NAME,
        getAttributePermission,
        { view: "_minimal" }
      );

      this.integerIdTestEntityAssociationM2MAttrsDc = loadAssociationOptions(
        DatatypesTestEntity.NAME,
        "integerIdTestEntityAssociationM2MAttr",
        IntegerIdTestEntity.NAME,
        getAttributePermission,
        { view: "_minimal" }
      );

      this.stringIdTestEntityAssociationO2OsDc = loadAssociationOptions(
        DatatypesTestEntity.NAME,
        "stringIdTestEntityAssociationO2O",
        StringIdTestEntity.NAME,
        getAttributePermission,
        { view: "_minimal" }
      );

      this.stringIdTestEntityAssociationM2OsDc = loadAssociationOptions(
        DatatypesTestEntity.NAME,
        "stringIdTestEntityAssociationM2O",
        StringIdTestEntity.NAME,
        getAttributePermission,
        { view: "_minimal" }
      );
    }
  };

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error(
          this.props.intl.formatMessage({
            id: "management.editor.validationError"
          })
        );
        return;
      }
      this.dataInstance
        .update(
          this.props.form.getFieldsValue(this.fields),
          this.isNewEntity() ? "create" : "edit"
        )
        .then(() => {
          message.success(
            this.props.intl.formatMessage({ id: "management.editor.success" })
          );
          this.updated = true;
        })
        .catch((e: any) => {
          if (e.response && typeof e.response.json === "function") {
            e.response.json().then((response: any) => {
              clearFieldErrors(this.props.form);
              const {
                globalErrors,
                fieldErrors
              } = extractServerValidationErrors(response);
              this.globalErrors = globalErrors;
              if (fieldErrors.size > 0) {
                this.props.form.setFields(
                  constructFieldsWithErrors(fieldErrors, this.props.form)
                );
              }

              if (fieldErrors.size > 0 || globalErrors.length > 0) {
                message.error(
                  this.props.intl.formatMessage({
                    id: "management.editor.validationError"
                  })
                );
              } else {
                message.error(
                  this.props.intl.formatMessage({
                    id: "management.editor.error"
                  })
                );
              }
            });
          } else {
            message.error(
              this.props.intl.formatMessage({ id: "management.editor.error" })
            );
          }
        });
    });
  };

  isNewEntity = () => {
    return this.props.entityId === DatatypesManagement1.NEW_SUBPATH;
  };

  render() {
    if (this.updated) {
      return <Redirect to={DatatypesManagement1.PATH} />;
    }

    const { status, lastError, load } = this.dataInstance;
    const { mainStore, entityId } = this.props;
    if (mainStore == null || !mainStore.isEntityDataLoaded()) {
      return <Spinner />;
    }

    // do not stop on "COMMIT_ERROR" - it could be bean validation, so we should show fields with errors
    if (status === "ERROR" && lastError === "LOAD_ERROR") {
      return (
        <>
          <FormattedMessage id="common.requestFailed" />.
          <br />
          <br />
          <Button htmlType="button" onClick={() => load(entityId)}>
            <FormattedMessage id="common.retry" />
          </Button>
        </>
      );
    }

    return (
      <Card className="narrow-layout">
        <Form onSubmit={this.handleSubmit} layout="vertical" ref={this.formRef}>
          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="bigDecimalAttr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="booleanAttr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{
              valuePropName: "checked"
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="dateAttr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="dateTimeAttr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="doubleAttr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="integerAttr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="longAttr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="stringAttr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="timeAttr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="uuidAttr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="localDateTimeAttr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="offsetDateTimeAttr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="localDateAttr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="localTimeAttr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="offsetTimeAttr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="enumAttr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="name"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="associationO2Oattr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            optionsContainer={this.associationO2OattrsDc}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="associationM2Oattr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            optionsContainer={this.associationM2OattrsDc}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="associationM2Mattr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            optionsContainer={this.associationM2MattrsDc}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="compositionO2Oattr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            nestedEntityView="compositionO2OTestEntity-view"
            parentEntityInstanceId={
              this.props.entityId !== DatatypesManagement1.NEW_SUBPATH
                ? this.props.entityId
                : undefined
            }
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="compositionO2Mattr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            nestedEntityView="compositionO2MTestEntity-view"
            parentEntityInstanceId={
              this.props.entityId !== DatatypesManagement1.NEW_SUBPATH
                ? this.props.entityId
                : undefined
            }
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="intIdentityIdTestEntityAssociationO2OAttr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            optionsContainer={this.intIdentityIdTestEntityAssociationO2OAttrsDc}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="integerIdTestEntityAssociationM2MAttr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            optionsContainer={this.integerIdTestEntityAssociationM2MAttrsDc}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="stringIdTestEntityAssociationO2O"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            optionsContainer={this.stringIdTestEntityAssociationO2OsDc}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="stringIdTestEntityAssociationM2O"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            optionsContainer={this.stringIdTestEntityAssociationM2OsDc}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="readOnlyStringAttr"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            disabled={true}
            getFieldDecoratorOpts={{}}
          />

          {this.globalErrors.length > 0 && (
            <Alert
              message={<MultilineText lines={toJS(this.globalErrors)} />}
              type="error"
              style={{ marginBottom: "24px" }}
            />
          )}

          <Form.Item style={{ textAlign: "center" }}>
            <Link to={DatatypesManagement1.PATH}>
              <Button htmlType="button">
                <FormattedMessage id="common.cancel" />
              </Button>
            </Link>
            <Button
              type="primary"
              htmlType="submit"
              disabled={status !== "DONE"}
              loading={status === "LOADING"}
              style={{ marginLeft: "8px" }}
            >
              <FormattedMessage id="common.submit" />
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }

  componentDidMount() {
    if (this.isNewEntity()) {
      this.dataInstance.setItem(new DatatypesTestEntity());
    } else {
      this.dataInstance.load(this.props.entityId);
    }

    this.reactionDisposers.push(
      reaction(
        () => this.dataInstance.status,
        () => {
          const { intl } = this.props;
          if (this.dataInstance.lastError != null) {
            message.error(intl.formatMessage({ id: "common.requestFailed" }));
          }
        }
      )
    );

    this.reactionDisposers.push(
      reaction(
        () => this.props.mainStore?.security.isDataLoaded,
        (isDataLoaded, permsReaction) => {
          if (isDataLoaded === true) {
            // User permissions has been loaded.
            // We can now load association options.
            this.loadAssociationOptions(); // Calls REST API
            permsReaction.dispose();
          }
        },
        { fireImmediately: true }
      )
    );

    this.reactionDisposers.push(
      reaction(
        () => this.formRef.current,
        (formRefCurrent, formRefReaction) => {
          if (formRefCurrent != null) {
            // The Form has been successfully created.
            // It is now safe to set values on Form fields.
            this.reactionDisposers.push(
              reaction(
                () => this.dataInstance.item,
                () => {
                  this.props.form.setFieldsValue(
                    this.dataInstance.getFieldValues(this.fields)
                  );
                },
                { fireImmediately: true }
              )
            );
            formRefReaction.dispose();
          }
        },
        { fireImmediately: true }
      )
    );
  }

  componentWillUnmount() {
    this.reactionDisposers.forEach(dispose => dispose());
  }
}

export default injectIntl(
  withLocalizedForm<EditorProps>({
    onValuesChange: (props: any, changedValues: any) => {
      // Reset server-side errors when field is edited
      Object.keys(changedValues).forEach((fieldName: string) => {
        props.form.setFields({
          [fieldName]: {
            value: changedValues[fieldName]
          }
        });
      });
    }
  })(DatatypesEdit1Component)
);
