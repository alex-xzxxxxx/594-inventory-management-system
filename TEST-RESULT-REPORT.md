# Test Results Report

**Execution date:** 2026-09-24  
**Overall result:** PASS

## Summary

| Test suite | Command | Result |
|---|---|---|
| Backend | `Push-Location inventory-system-backend; mvn test; Pop-Location` | 16 passed, 0 failed, 0 errors, 0 skipped |
| Angular | `Push-Location inventory-system-ui; npm test; Pop-Location` | 46 passed, 0 failed |

## Backend Details

| Test class | Tests | Failures | Errors | Skipped |
|---|---:|---:|---:|---:|
| `InventorySystemTest` | 8 | 0 | 0 | 0 |
| `PersistenceSystemTest` | 1 | 0 | 0 | 0 |
| `BackendSmokeTest` | 1 | 0 | 0 | 0 |
| `InventoryControllerRegressionTest` | 1 | 0 | 0 | 0 |
| `InventoryServiceTest` | 3 | 0 | 0 | 0 |
| `PurchaseOrderServiceTest` | 2 | 0 | 0 | 0 |
| **Total** | **16** | **0** | **0** | **0** |

Backend Maven build result: **BUILD SUCCESS**.

## Angular Details

Angular Karma/ChromeHeadless result: **46 tests passed**.

| Coverage metric | Result |
|---|---:|
| Statements | 91.72% (266/290) |
| Branches | 67.79% (40/59) |
| Functions | 89.74% (105/117) |
| Lines | 92.51% (235/254) |

## Covered System Flows

- Product and supplier update endpoints, including not-found responses
- Product search with no matching results
- Login, logout, protected-route redirection, and inactivity auto-logout
- Dashboard content rendering
- JSON persistence across a backend store restart
- Inventory stock-in, stock-out, validation, audit trail, and purchase-order workflows

## Informational Warnings

- Spring reports `@MockBean` as deprecated in `InventoryControllerRegressionTest`.
- Mockito reports that dynamic Java-agent attachment will require explicit configuration in a future JDK release.

Neither warning caused a test failure.