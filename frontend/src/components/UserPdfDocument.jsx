import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 10,
  },
  bodyText: {
    fontSize: 9,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  generatedAt: {
    fontSize: 8,
    color: "#999",
    textAlign: "right",
    marginTop: 20,
  },
});

const UserPdfDocument = ({ users, baseUrl }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>User Accounts Report</Text>
        <Text style={styles.subtitle}>List of all registered users</Text>
      </View>

      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Profile</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Username</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Email</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Details</Text>
          </View>
        </View>

        {/* Table Rows */}
        {users.map((user) => (
          <View key={user._id} style={styles.tableRow}>
            <View style={styles.tableCol}>
              {user.profileImage ? (
                <Image
                  src={`${baseUrl}/${user.profileImage.replace(/\\/g, "/")}`}
                  style={styles.avatar}
                />
              ) : (
                <Text style={styles.bodyText}>No Image</Text>
              )}
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.bodyText}>{user.username}</Text>
              <Text style={[styles.bodyText, { color: "#666" }]}>
                {user.role}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.bodyText}>{user.email}</Text>
              <Text style={[styles.bodyText, { color: "#666" }]}>
                {user.phoneNumber}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.bodyText}>
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.generatedAt}>
        Generated on: {new Date().toLocaleString()}
      </Text>
    </Page>
  </Document>
);

export default UserPdfDocument;
