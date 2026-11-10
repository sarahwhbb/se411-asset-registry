package edu.psu.se411.backend;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AssetController.class)
class AssetControllerTest {

	private static final String JSON = """
			{"assetTag":"PC-1","brand":"Dell","model":"Latitude","serialNumber":"S1",
			 "purchaseDate":"2024-01-01","status":"In use","assignedTo":"Sara","price":1000}""";

	@Autowired
	MockMvc mvc;

	@MockitoBean
	AssetService service;

	private Asset asset(Long id) {
		return new Asset(id, "PC-1", "Dell", "Latitude", "S1", LocalDate.of(2024, 1, 1), "In use", "Sara", 1000.0);
	}

	@Test
	void postCreatesAnAssetAndReturns201() throws Exception {
		when(service.create(any(Asset.class))).thenReturn(asset(7L));

		mvc.perform(post("/api/assets").contentType(MediaType.APPLICATION_JSON).content(JSON))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id").value(7))
				.andExpect(jsonPath("$.assetTag").value("PC-1"))
				.andExpect(jsonPath("$.purchaseDate").value("2024-01-01"));
	}

	@Test
	void postRejectsInvalidInputWith400() throws Exception {
		String bad = """
				{"assetTag":"","brand":"Dell","model":"Latitude","serialNumber":"S1",
				 "purchaseDate":"2999-01-01","status":"Broken","price":-5}""";

		mvc.perform(post("/api/assets").contentType(MediaType.APPLICATION_JSON).content(bad))
				.andExpect(status().isBadRequest());

		verify(service, never()).create(any(Asset.class));
	}

	@Test
	void putRejectsInvalidInputWith400() throws Exception {
		String bad = JSON.replace("\"brand\":\"Dell\"", "\"brand\":\"  \"");

		mvc.perform(put("/api/assets/1").contentType(MediaType.APPLICATION_JSON).content(bad))
				.andExpect(status().isBadRequest());

		verify(service, never()).update(eq(1L), any(Asset.class));
	}

	@Test
	void getByIdReturnsTheAsset() throws Exception {
		when(service.get(1L)).thenReturn(asset(1L));

		mvc.perform(get("/api/assets/1"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.brand").value("Dell"))
				.andExpect(jsonPath("$.price").value(1000.0));
	}

	@Test
	void getByIdReturns404WhenMissing() throws Exception {
		when(service.get(9L)).thenThrow(new AssetNotFoundException(9L));

		mvc.perform(get("/api/assets/9")).andExpect(status().isNotFound());
	}

	@Test
	void listReturnsASpringPage() throws Exception {
		PageRequest request = PageRequest.of(1, 2);
		when(service.list(request)).thenReturn(new PageImpl<>(List.of(asset(3L), asset(4L)), request, 6));

		mvc.perform(get("/api/assets").param("page", "1").param("size", "2"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content.length()").value(2))
				.andExpect(jsonPath("$.content[0].id").value(3))
				.andExpect(jsonPath("$.totalPages").value(3));
	}

	@Test
	void putUpdatesTheAssetAtThePathId() throws Exception {
		when(service.update(eq(1L), any(Asset.class))).thenReturn(asset(1L));

		mvc.perform(put("/api/assets/1").contentType(MediaType.APPLICATION_JSON).content(JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(1));
	}

	@Test
	void putReturns404WhenMissing() throws Exception {
		when(service.update(eq(9L), any(Asset.class))).thenThrow(new AssetNotFoundException(9L));

		mvc.perform(put("/api/assets/9").contentType(MediaType.APPLICATION_JSON).content(JSON))
				.andExpect(status().isNotFound());
	}

	@Test
	void deleteReturns204() throws Exception {
		mvc.perform(delete("/api/assets/1")).andExpect(status().isNoContent());

		verify(service).delete(1L);
	}

	@Test
	void deleteReturns404WhenMissing() throws Exception {
		doThrow(new AssetNotFoundException(9L)).when(service).delete(9L);

		mvc.perform(delete("/api/assets/9")).andExpect(status().isNotFound());
	}

	@Test
	void allowsTheViteDevServerOrigin() throws Exception {
		when(service.get(1L)).thenReturn(asset(1L));

		mvc.perform(get("/api/assets/1").header("Origin", "http://localhost:5173"))
				.andExpect(status().isOk())
				.andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
	}
}
